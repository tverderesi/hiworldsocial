import App from "./App";
import { InMemoryCache, ApolloClient } from "@apollo/client";
import { createHttpLink } from "@apollo/client/link/http";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";

const FALLBACK_SERVER_URL = "http://localhost:5000/" as const;

const httpLink = createHttpLink({
  uri:
    import.meta.env.VITE_GRAPHQL_ENDPOINT ??
    FALLBACK_SERVER_URL,
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
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
