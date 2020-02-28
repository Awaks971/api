const { gql } = require("apollo-server-express");

const CashJournalType = gql`
  type CashJournal {
    id: ID
    store_id: ID
    company_id: ID
    date: String
    amount_ttc: Float
    amount_ht: Float
    basket_median: Float
    canceled_lines: Int
    profit_amount: Float
    profit_rate: Float
    article_count: Int
    receipt_count: Int
  }

  input RangeInputType {
    start: String
    end: String
  }
`;

module.exports = { CashJournalType };
