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
    article_id: ID
    label: String
    profit: Float
    amount_ttc: Float
    amount_ht: Float
    article_count: Int
  }

  type TopFamily {
    label: String
    id: ID
    amount_ttc: Float
    amount_ht: Float
    amount_vat: Float
    vat_rate: Float
    profit: Float
    article_count: Int
  }
  type TopSeller {
    name: String
    id: ID
    amount_ttc: Float
    article_count: Int
  }

  type Payments {
    label: String
  }
  type PaymentMode {
    label: String
    paid_amount: Float
    returned_amount: Float
  }

  type TopMonth {
    amount_ht: Float
    amount_ttc: Float
    month: String
    year: String
    payments: [TopPaymentMonth]
    total: [TopPaymentMonth]
  }

  type Year {
    year: Int
  }

  type TopPaymentMonth {
    paid_amount: Float
    payment_label: String
  }
`;

module.exports = { ReceiptType };
