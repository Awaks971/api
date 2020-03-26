const { gql } = require("apollo-server-express");

const CompanyType = gql`
  type Company {
    id: ID
    siret: String
    email: String
    phone: String
    owner: User
    name: String

    address: CompanyAddress
  }

  type CompanyAddress {
    line1: String
    postal_code: String
    country: String
  }

  input CompanyAddressInputType {
    line1: String
    postal_code: String
    country: String
    city: String
  }

  input SwitchCompanyInputType {
    id: ID
    name: String
    address: CompanyAddressInputType
  }
`;

module.exports = { CompanyType };
