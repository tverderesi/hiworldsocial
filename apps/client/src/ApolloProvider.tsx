import App from "./App";
import { InMemoryCache, ApolloClient } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createHttpLink } from "@apollo/client/link/http";
import { ApolloProvider } from "@apollo/client/react";

const FALLBACK_SERVER_URL = "http://localhost:5000/" as const;

const httpLink = createHttpLink({
  uri:
    import.meta.env.VITE_GRAPHQL_ENDPOINT ??
    FALLBACK_SERVER_URL,
  credentials: "omit",
});

const authLink = setContext((_, { headers }) => {
  const token = window.localStorage.getItem("authToken");

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
