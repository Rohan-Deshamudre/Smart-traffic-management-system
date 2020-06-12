import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { onError } from 'apollo-link-error'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// Imports for local store
import { resolvers } from './local_store/resolvers';
import { schema } from './local_store/schema';
import { defaultStore } from "./local_store/default";
import { ApolloLink } from 'apollo-link';

import { Auth } from './helper/auth';
import gql from "graphql-tag";

const REFRESH = gql`
    mutation RefreshToken($token: String!) {
        refreshToken(token: $token) {
            token
        }
    }
`;

// https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
// Add the correct link
const httpLink = createHttpLink({
    uri: process.env.API_URL,
});

const errorLink = onError(({ gql, net }) => {
    if (gql) {
        gql.forEach(({ message, locations, path }) =>
            console.log(`[GQL ERROR]: ${message}, ${locations}, ${path}`))
    }
    if (net) {
        console.log(`[Network]: ${net}`)
    }
})

let isRefreshing = false;

const authMiddleware = new ApolloLink((operation, forward) => {

    if (Auth.getToken() && !Auth.hasValidToken() && !isRefreshing) {

        isRefreshing = true;

        client.mutate({
            mutation: REFRESH,
            variables: {
                token: Auth.getToken()
            }
        }).then(
            (response) => {
                Auth.saveToken(response.data.refreshToken.token);
                isRefreshing = false;
            },
            () => {
                // TODO say session expired navigate back to login.
                Auth.eraseToken();
                isRefreshing = false;
            }
        );
    }

    if (Auth.getToken()) {

        operation.setContext({
            headers: {
                Authorization: `JWT ${Auth.getToken()}`
            }
        });

        return forward(operation)
    } else {
        return forward(operation)
    }
});

const link = ApolloLink.from([
    errorLink,
    authMiddleware,
    httpLink
]);

const cache = new InMemoryCache();

// Create the client
const client = new ApolloClient({
    resolvers: resolvers,
    typeDefs: schema,
    //TODO: add logout call on token expiration
    link,
    cache
});

// Set default local state
cache.writeData({ data: defaultStore });
client.onResetStore(() => cache.writeData({ data })); // If client.resetStore is called

// Render the app
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('app')
);
