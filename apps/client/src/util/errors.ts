export function getGraphQLErrors(error: any) {
  return error?.graphQLErrors?.[0]?.extensions?.errors ?? {};
}

export function getGraphQLErrorMessage(error: any) {
  return error?.graphQLErrors?.[0]?.message ?? error?.message;
}
