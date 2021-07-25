import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <Router>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </Router>,
    document.getElementById('root')
);