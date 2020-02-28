const { gql } = require("apollo-server-express");

const TechnicianType = gql`
  type Technician {
    id: ID
    firstname: String
    lastname: String
    email: String
    phone: String
    status: String
    created_at: String
  }

  input TechnicianInputType {
    firstname: String
    lastname: String
    email: String
    phone: String
  }
`;

module.exports = { TechnicianType };
