const { gql } = require("apollo-server-express");

const EmployeType = gql`
  type Employe {
    id: ID
    code: String
    companiId: ID
  }
`;

module.exports = { EmployeType };
