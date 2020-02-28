/**
 * Require `dotenv` to read environment variables
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const context = require("./graphql/context");
const headers = require("./config/headers");
const app = express();
const loginHandler = require("./config/login");

/**
 * Apply some middlewares
 */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(headers);

/**
 * Login handler to set token in GraphQL context
 */

app.post("/login", headers, loginHandler);

/**
 * GraphQL setup
 */

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
});

server.applyMiddleware({ app });

module.exports = app;
