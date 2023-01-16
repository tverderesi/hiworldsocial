import App from './App';
import {
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  ApolloClient,
  ApolloLink,
} from '@apollo/client';
import { setContext } from 'apollo-link-context';

const httpLink = createHttpLink({ uri: 'http://localhost:5000' });

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken');
  return {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  };
});

const client = new ApolloClient({
  //@ts-ignore
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
console.log(client);
export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
