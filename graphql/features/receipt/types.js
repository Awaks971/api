const { gql } = require("apollo-server-express");

const ReceiptType = gql`
  type Receipt {
    id: ID
    store_id: ID
    company_id: ID
    date: String
    amount_ttc: Float
    amount_ht: Float
    amount_vat: Float
    profit: Float
    article_count: Int
    client_id: ID
    seller_id: ID
    seller_name: String
    fees_rate: Float
    cash_journal_id: ID
    canceled_articles: Int
    discount_rate: Float
    line_count: Int
    receipt_number: String
    lines: [ReceiptLine]
    vat: ReceiptVAT
  }

  type ReceiptLine {
    id: ID
    receipt_id: ID

    amount_ttc: Float
    amount_ht: Float
    amount_vat: Float
    amount_discount: Float
    vat_rate: Float

    label: String
    label_extra: String

    article_id: ID
    canceled_articles: Int
    article_count: Int
    profit: Float

    line_position: Int
    purchase_price: Float

    sell_price: Float
  }

  type ReceiptVAT {
    tax_document_id: ID
    group: [ReduceReceiptVAT]
    total_ht: Float
    total_vat: Float
    payment_mode: [PaymentMode]
  }

  type ReduceReceiptVAT {
    amount_ht: Float
    amount_vat: Float
    vat_rate: Float
  }

  # We're not handle articles now
  # So I decided to name this type StatsArticle
  # Temporary workaround to rename it :)
  type StatsArticle {
    id: ID
    label: String
    profit: Float
    amount_ttc: Float
    article_count: Int
  }

  type TopFamily {
    label: String
    id: ID
    amount_ttc: Float
    article_count: Int
  }
  type TopSeller {
    name: String
    id: ID
    amount_ttc: Float
    article_count: Int
  }
  type PaymentMode {
    label: String
    paid_amount: Float
    returned_amount: Float
  }
`;

module.exports = { ReceiptType };
