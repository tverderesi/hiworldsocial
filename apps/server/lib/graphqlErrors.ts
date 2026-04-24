import { GraphQLError } from "graphql";

export function createGraphQLError(
  message: string,
  code: string,
  extensions: Record<string, unknown> = {}
) {
  return new GraphQLError(message, {
    extensions: {
      code,
      ...extensions,
    },
  });
}

export function createAuthenticationError(message: string) {
  return createGraphQLError(message, "UNAUTHENTICATED", {
    http: { status: 401 },
  });
}

export function createForbiddenError(message: string) {
  return createGraphQLError(message, "FORBIDDEN", {
    http: { status: 403 },
  });
}

export function createUserInputError(
  message: string,
  extensions: Record<string, unknown> = {}
) {
  return createGraphQLError(message, "BAD_USER_INPUT", extensions);
}
