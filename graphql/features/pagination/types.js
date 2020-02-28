const { gql } = require("apollo-server-express");

const PaginationType = gql`
  type PaginationType {
    total_rows: Int
  }
`;

module.exports = { PaginationType };
