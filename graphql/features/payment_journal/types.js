const { gql } = require("apollo-server-express");

const PaymentJournalType = gql`
  type TopPaymentMode {
    label: String
    amount: Float
    count: Int
  }
`;

module.exports = { PaymentJournalType };
