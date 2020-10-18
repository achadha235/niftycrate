import { InMemoryCache } from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import getConfig from 'next/config';
import withApollo from 'next-with-apollo';
import { AuthToken } from '../constants';

const { publicRuntimeConfig } = getConfig();
const backend = publicRuntimeConfig.GQL_ENDPOINT;

export default withApollo(({ headers: reqHeaders, initialState }) => {
  async function cookieForwardingFetch(url: RequestInfo, init: RequestInit) {
    let cookie;
    if (reqHeaders && reqHeaders.cookie) {
      cookie = reqHeaders.cookie;
    } else if (
      typeof localStorage !== 'undefined' &&
      localStorage.getItem(AuthToken)
    ) {
      cookie = localStorage.getItem(AuthToken);
    }
    let headers = { ...init.headers };
    if (cookie) {
      headers['authorization'] = cookie;
    }
    return fetch(url, { ...init, headers });
  }

  const httpLink = createHttpLink({
    uri: backend,
    credentials: 'include',
    fetch: cookieForwardingFetch,
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: httpLink,
    cache: new InMemoryCache({ addTypename: true }).restore(initialState || {}),
  });
});
