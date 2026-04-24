import { GraphQLError } from "graphql";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const countDocumentsMock = vi.fn();
const findOneMock = vi.fn();
const saveMock = vi.fn();
const checkAuthMock = vi.fn();

vi.mock("../../models/Post", () => {
  function PostMock(data: Record<string, unknown>) {
    return {
      ...data,
      save: saveMock,
    };
  }

  return {
    default: Object.assign(PostMock, {
      countDocuments: countDocumentsMock,
      findOne: findOneMock,
      find: vi.fn(),
      findById: vi.fn(),
    }),
  };
});

vi.mock("../../utils/checkAuth", () => ({
  default: checkAuthMock,
}));

function getSingleResult(response: any) {
  expect(response.body.kind).toBe("single");
  return response.body.singleResult;
}

describe("post resolvers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Date, "now").mockReturnValue(
      new Date("2026-04-23T12:00:00.000Z").getTime()
    );
    process.env.SECRET_KEY = "test-secret";
    process.env.POST_RATE_LIMIT_MAX_POSTS = "2";
    process.env.POST_RATE_LIMIT_WINDOW_SECONDS = "60";
    checkAuthMock.mockReturnValue({
      id: "507f1f77bcf86cd799439011",
      username: "alice",
      profilePicture: "ade",
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a post when the user is under the rate limit", async () => {
    countDocumentsMock.mockResolvedValue(1);
    saveMock.mockResolvedValue({
      id: "post-1",
      body: "hello world",
      username: "alice",
    });

    const { createApolloServer } = await import("../../server");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation CreatePost($body: String!) {
          createPost(body: $body) {
            id
            body
            username
          }
        }
      `,
      variables: {
        body: "hello world",
      },
    });

    await server.stop();
    const result = getSingleResult(response);

    expect(result.errors).toBeUndefined();
    expect(result.data?.createPost).toEqual({
      id: "post-1",
      body: "hello world",
      username: "alice",
    });
    expect(countDocumentsMock).toHaveBeenCalledWith({
      user: "507f1f77bcf86cd799439011",
      createdAt: { $gte: "2026-04-23T11:59:00.000Z" },
    });
    expect(findOneMock).not.toHaveBeenCalled();
  });

  it("rejects post creation when the rate limit is exceeded", async () => {
    countDocumentsMock.mockResolvedValue(2);
    findOneMock.mockReturnValue({
      sort: vi.fn().mockReturnValue({
        select: vi
          .fn()
          .mockResolvedValue({ createdAt: "2026-04-23T11:59:30.000Z" }),
      }),
    });

    const { createApolloServer } = await import("../../server");
    const server = createApolloServer();

    const response = await server.executeOperation({
      query: `
        mutation CreatePost($body: String!) {
          createPost(body: $body) {
            id
          }
        }
      `,
      variables: {
        body: "blocked",
      },
    });

    await server.stop();
    const result = getSingleResult(response);

    expect(result.data).toBeNull();
    expect(result.errors).toHaveLength(1);
    expect((result.errors?.[0] as GraphQLError).message).toBe(
      "Rate limit exceeded. You can create up to 2 posts every 60 seconds. Try again in 30 seconds."
    );
    expect((result.errors?.[0] as GraphQLError).extensions).toMatchObject({
      code: "TOO_MANY_REQUESTS",
      errors: {
        rateLimit:
          "Rate limit exceeded. You can create up to 2 posts every 60 seconds. Try again in 30 seconds.",
      },
      retryAfterSeconds: 30,
    });
    expect(saveMock).not.toHaveBeenCalled();
  });
});
