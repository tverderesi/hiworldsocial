function getFirstGraphQLError(error: any) {
  return (
    error?.graphQLErrors?.[0] ??
    error?.errors?.[0] ??
    error?.cause?.graphQLErrors?.[0] ??
    error?.cause?.errors?.[0]
  );
}

export function getGraphQLErrors(error: any) {
  return getFirstGraphQLError(error)?.extensions?.errors ?? {};
}

export function getGraphQLErrorMessage(error: any) {
  return getFirstGraphQLError(error)?.message ?? error?.message;
}
