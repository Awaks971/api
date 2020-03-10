const { gql } = require("apollo-server-express");

const UserType = gql`
  type User {
    id: ID
    firstname: String
    lastname: String
    email: String
    token: String
    loggedAs: Company
    companies: [Company]
    role: String
    status: String
    company_id: ID
  }

  type Context {
    userId: ID
    token: String
    loggedAs: String
    userCompanies: [Company]
  }

  input CredentialsInputType {
    email: String!
    password: String!
  }

  input CreateUserInputType {
    email: String!
    firstname: String!
    lastname: String!
    password: String!
  }

  input FinishRegisterInputType {
    email: String!
    firstname: String!
    lastname: String!
    new_password: String!
  }
  input LockAccount {
    email: String!
  }
`;

module.exports = { UserType };
