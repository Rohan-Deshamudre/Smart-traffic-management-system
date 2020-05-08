import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// Imports for local store
import { resolvers } from './local_store/resolvers';
import { schema } from './local_store/schema';
import { defaultStore } from "./local_store/default";
import { Cache } from "apollo-cache/lib/types";
import { ApolloLink } from 'apollo-link';

import { Auth } from './helper/auth';

// https://hasura.io/blog/best-practices-of-using-jwt-with-graphql/
// Add the correct link
const httpLink = createHttpLink({
    uri: process.env.API_URL,
});

const authMiddleware = new ApolloLink((operation, forward) => {
    let token = Auth.isLoggedIn()
    console.log(token);
    if (token) {
        operation.setContext({
            headers: {
                Authorization: `JWT ${token}`
            }
        });
        console.log(`JWT $token`)
    }
    return forward(operation);
})

const link = ApolloLink.from([
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
