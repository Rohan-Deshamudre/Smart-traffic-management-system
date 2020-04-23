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
import {Cache} from "apollo-cache/lib/types";


// Add the correct link
const httpLink = createHttpLink({
    uri: process.env.API_URL
});

const cache = new InMemoryCache();

// Create the client
const client = new ApolloClient({
    resolvers: resolvers,
    typeDefs: schema,
    link: httpLink,
    cache: cache,
});

// Set default local state
cache.writeData({data: defaultStore });
client.onResetStore(() => cache.writeData({ data })); // If client.resetStore is called

// Render the app
ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('app')
);
