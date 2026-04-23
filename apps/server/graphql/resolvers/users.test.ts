import { GraphQLError } from "graphql";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findOneMock = vi.fn();
const saveMock = vi.fn();
const hashMock = vi.fn();
const compareMock = vi.fn();
const signMock = vi.fn();

vi.mock("../../models/User.js", () => {
  function UserMock(data: Record<string, unknown>) {
    return {
      ...data,
      save: saveMock,
    };
  }

  return {
    default: Object.assign(UserMock, {
      findOne: findOneMock,
    }),
  };
});

vi.mock("bcryptjs", () => ({
  default: {
    hash: hashMock,
    compare: compareMock,
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: signMock,
  },
}));

describe("user resolvers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SECRET_KEY = "test-secret";
  });

  it("registers a user through the GraphQL mutation", async () => {
    findOneMock.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    hashMock.mockResolvedValue("hashed-password");
    signMock.mockReturnValue("signed-token");

    const savedUser = {
      id: "user-1",
      email: "alice@example.com",
      username: "alice",
      password: "hashed-password",
      createdAt: "2026-04-23T00:00:00.000Z",
      profilePicture: "ade",
      toObject() {
        return {
          email: this.email,
          username: this.username,
          password: this.password,
          createdAt: this.createdAt,
          profilePicture: this.profilePicture,
        };
      },
    };

    saveMock.mockResolvedValue(savedUser);

    const { createApolloServer } = await import("../../server.js");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation Register($registerInput: RegisterInput!) {
          register(registerInput: $registerInput) {
            id
            username
            email
            profilePicture
            token
          }
        }
      `,
      variables: {
        registerInput: {
          username: "alice",
          email: "alice@example.com",
          password: "Password1!",
          confirmPassword: "Password1!",
          profilePicture: "ade",
        },
      },
    });

    await server.stop();

    expect(response.errors).toBeUndefined();
    expect(response.data?.register).toEqual({
      id: "user-1",
      username: "alice",
      email: "alice@example.com",
      profilePicture: "ade",
      token: "signed-token",
    });
    expect(hashMock).toHaveBeenCalledWith("Password1!", 12);
    expect(findOneMock).toHaveBeenNthCalledWith(1, { username: "alice" });
    expect(findOneMock).toHaveBeenNthCalledWith(2, { email: "alice@example.com" });
  });

  it("rejects duplicate usernames during registration", async () => {
    findOneMock.mockResolvedValueOnce({ username: "alice" });

    const { createApolloServer } = await import("../../server.js");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation Register($registerInput: RegisterInput!) {
          register(registerInput: $registerInput) {
            id
          }
        }
      `,
      variables: {
        registerInput: {
          username: "alice",
          email: "alice@example.com",
          password: "Password1!",
          confirmPassword: "Password1!",
          profilePicture: "ade",
        },
      },
    });

    await server.stop();

    expect(response.data).toBeNull();
    expect(response.errors).toHaveLength(1);
    expect((response.errors?.[0] as GraphQLError).extensions?.errors).toMatchObject({
      username: "This username is taken!",
    });
  });

  it("logs a user in with valid credentials", async () => {
    compareMock.mockResolvedValue(true);
    signMock.mockReturnValue("signed-token");
    findOneMock.mockResolvedValue({
      id: "user-1",
      email: "alice@example.com",
      username: "alice",
      password: "hashed-password",
      createdAt: "2026-04-23T00:00:00.000Z",
      profilePicture: "ade",
      toObject() {
        return {
          email: this.email,
          username: this.username,
          password: this.password,
          createdAt: this.createdAt,
          profilePicture: this.profilePicture,
        };
      },
    });

    const { createApolloServer } = await import("../../server.js");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            username
            token
          }
        }
      `,
      variables: {
        username: "alice",
        password: "Password1!",
      },
    });

    await server.stop();

    expect(response.errors).toBeUndefined();
    expect(response.data?.login).toEqual({
      username: "alice",
      token: "signed-token",
    });
    expect(compareMock).toHaveBeenCalledWith("Password1!", "hashed-password");
  });
});
