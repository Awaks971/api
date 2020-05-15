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
  type ResetPassword {
    token_id: ID!
    message: String
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

  input PersonalInformationsInputType {
    email: String!
    firstname: String!
    lastname: String!
  }
  input StoreInputType {
    name: String
    id: String
    phone: String
    address: CompanyAddressInputType
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
