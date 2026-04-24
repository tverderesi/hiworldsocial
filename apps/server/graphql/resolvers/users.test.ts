import { GraphQLError } from "graphql";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findOneMock = vi.fn();
const saveMock = vi.fn();
const hashMock = vi.fn();
const compareMock = vi.fn();
const signMock = vi.fn();
const sendEmailMock = vi.fn();

vi.mock("../../models/User", () => {
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

vi.mock("../../lib/email", () => ({
  sendEmail: sendEmailMock,
}));

function getSingleResult(response: any) {
  expect(response.body.kind).toBe("single");
  return response.body.singleResult;
}

describe("user resolvers", () => {
  beforeEach(() => {
    findOneMock.mockReset();
    saveMock.mockReset();
    hashMock.mockReset();
    compareMock.mockReset();
    signMock.mockReset();
    sendEmailMock.mockReset();
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

    const { createApolloServer } = await import("../../server");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation Register($registerInput: RegisterInput!) {
          register(registerInput: $registerInput) {
            id
            username
            email
            profilePicture
            createdAt
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
    const result = getSingleResult(response);

    expect(result.errors).toBeUndefined();
    expect(result.data?.register).toEqual({
      id: "user-1",
      username: "alice",
      email: "alice@example.com",
      profilePicture: "ade",
      createdAt: "2026-04-23T00:00:00.000Z",
      token: "signed-token",
    });
    expect(hashMock).toHaveBeenCalledWith("Password1!", 12);
    expect(findOneMock).toHaveBeenNthCalledWith(1, { username: "alice" });
    expect(findOneMock).toHaveBeenNthCalledWith(2, { email: "alice@example.com" });
  });

  it("rejects duplicate usernames during registration", async () => {
    findOneMock.mockResolvedValueOnce({ username: "alice" });

    const { createApolloServer } = await import("../../server");
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
    const result = getSingleResult(response);

    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect((result.errors?.[0] as GraphQLError).extensions?.errors).toMatchObject({
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

    const { createApolloServer } = await import("../../server");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation Login($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            id
            username
            email
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
    const result = getSingleResult(response);

    expect(result.errors).toBeUndefined();
    expect(result.data?.login).toEqual({
      id: "user-1",
      username: "alice",
      email: "alice@example.com",
      token: "signed-token",
    });
    expect(compareMock).toHaveBeenCalledWith("Password1!", "hashed-password");
  });

  it("returns the same password reset response for unknown emails", async () => {
    findOneMock.mockResolvedValue(null);

    const { createApolloServer } = await import("../../server");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation RequestPasswordReset($email: String!) {
          requestPasswordReset(email: $email) {
            success
            message
          }
        }
      `,
      variables: {
        email: "missing@example.com",
      },
      http: {
        headers: new Headers({
          "x-forwarded-for": "203.0.113.10",
        }),
      },
    });

    await server.stop();
    const result = getSingleResult(response);

    expect(result.errors).toBeUndefined();
    expect(result.data?.requestPasswordReset).toEqual({
      success: true,
      message:
        "If an account exists for that email, a password reset link has been sent.",
    });
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("sends a password reset email for existing users without exposing that fact", async () => {
    const saveUserMock = vi.fn().mockResolvedValue(undefined);
    findOneMock.mockResolvedValue({
      email: "alice@example.com",
      passwordResetRequestedAt: null,
      passwordResetRequestCount: 0,
      save: saveUserMock,
    });
    sendEmailMock.mockResolvedValue({ id: "email-1" });

    const { createApolloServer } = await import("../../server");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation RequestPasswordReset($email: String!) {
          requestPasswordReset(email: $email) {
            success
            message
          }
        }
      `,
      variables: {
        email: "alice@example.com",
      },
      http: {
        headers: new Headers({
          "x-forwarded-for": "203.0.113.11",
        }),
      },
    });

    await server.stop();
    const result = getSingleResult(response);

    expect(result.errors).toBeUndefined();
    expect(result.data?.requestPasswordReset).toEqual({
      success: true,
      message:
        "If an account exists for that email, a password reset link has been sent.",
    });
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(saveUserMock).toHaveBeenCalledTimes(1);
  });

  it("resets a password when presented with a valid token", async () => {
    const saveUserMock = vi.fn().mockResolvedValue(undefined);
    hashMock.mockResolvedValue("hashed-new-password");
    findOneMock.mockResolvedValue({
      passwordResetExpiresAt: "3026-04-23T00:00:00.000Z",
      save: saveUserMock,
    });

    const { createApolloServer } = await import("../../server");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation ResetPassword(
          $token: String!
          $password: String!
          $confirmPassword: String!
        ) {
          resetPassword(
            token: $token
            password: $password
            confirmPassword: $confirmPassword
          ) {
            success
            message
          }
        }
      `,
      variables: {
        token: "valid-token",
        password: "Password1!",
        confirmPassword: "Password1!",
      },
    });

    await server.stop();
    const result = getSingleResult(response);

    expect(result.errors).toBeUndefined();
    expect(result.data?.resetPassword).toEqual({
      success: true,
      message: "Your password has been reset. You can now log in with the new password.",
    });
    expect(hashMock).toHaveBeenCalledWith("Password1!", 12);
    expect(saveUserMock).toHaveBeenCalledTimes(1);
  });
});
