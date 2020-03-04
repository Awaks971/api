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

const session = require("express-session");
const MemoryStore = require("memorystore")(session);

/**
 * Apply some middlewares
 */

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(headers);

app.use(
  session({
    cookie: { maxAge: 10 },
    store: new MemoryStore({
      checkPeriod: 10 // prune expired entries every hour
    }),
    secret: "AwaksGu@deloupe#971",
    resave: true,
    saveUninitialized: true
  })
);

/**
 * Login handler to set token in GraphQL context
 */

app.post("/api/login", headers, loginHandler);

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
