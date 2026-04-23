import { describe, expect, it } from "vitest";

import { getGraphQLErrors, getGraphQLErrorMessage } from "./errors";

describe("GraphQL error helpers", () => {
  it("reads Apollo Client 4 CombinedGraphQLErrors shape", () => {
    const error = {
      errors: [
        {
          message: "Errors",
          extensions: {
            errors: {
              username: "This username is taken!",
            },
          },
        },
      ],
    };

    expect(getGraphQLErrors(error)).toEqual({
      username: "This username is taken!",
    });
    expect(getGraphQLErrorMessage(error)).toBe("Errors");
  });

  it("falls back to the legacy graphQLErrors path", () => {
    const error = {
      graphQLErrors: [
        {
          message: "Legacy error",
          extensions: {
            errors: {
              email: "Email must be valid.",
            },
          },
        },
      ],
    };

    expect(getGraphQLErrors(error)).toEqual({
      email: "Email must be valid.",
    });
    expect(getGraphQLErrorMessage(error)).toBe("Legacy error");
  });
});
