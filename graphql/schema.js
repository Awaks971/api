const { gql } = require("apollo-server-express");
const { UserType } = require("./features/user/types");
const { CashJournalType } = require("./features/cash_journal/types");
const { CompanyType } = require("./features/company/types");
const { TechnicianType } = require("./features/technician/types");
const { ReceiptType } = require("./features/receipt/types");
const { PaginationType } = require("./features/pagination/types");
const { PaymentJournalType } = require("./features/payment_journal/types");

const schema = gql`
  ${UserType}
  ${CashJournalType}
  ${CompanyType}
  ${TechnicianType}
  ${ReceiptType}
  ${PaginationType}
  ${PaymentJournalType}

  type Query {
    me: User
    technicians: [Technician]
    users: [User]

    cash_journals(
      group_by_day: Boolean
      group_by_company: Boolean
      order_ASC: Boolean
      order_DESC: Boolean
      amount_ttc_sum: Boolean
      canceled_lines_sum: Boolean

      basket_median: Boolean
      profit_sum: Boolean

      receipt_sum: Boolean
      range: RangeInputType
    ): [CashJournal]
    cash_journal(id: ID!): CashJournal

    receipt(id: ID!): Receipt
    receipts(cash_journal_id: ID!): [Receipt]

    articles_stats(
      range: RangeInputType
      limit: Int
      start_at: Int
      order_by: String
    ): [StatsArticle]

    pagination(by: String!, table: String!): PaginationType
    top_families(range: RangeInputType, limit: Int): [TopFamily]
    top_sellers(range: RangeInputType, limit: Int): [TopSeller]
    top_payment_mode(range: RangeInputType): [TopPaymentMode]
    top_month(range: Int): [TopMonth]
    total_payment_by_year(range: Int): [TopPaymentMonth]
    get_years_on_receipt: [Year]
  }

  type Mutation {
    register(credentials: CreateUserInputType!): User
    switch_company(companyId: ID!): Context
    add_technician(technician: TechnicianInputType!): Technician
    disable_technician(technicianId: ID!, status: String!): Technician
    disable_user(userId: ID!, status: String!): User
    valid_user(userId: ID!, company_id: ID!): User
    finish_register(user: FinishRegisterInputType!): User
    lock_account(user: LockAccount!): User
    update_password(new_password: String!): User
    update_store(store: StoreInputType!): Company
    update_personal_informations(
      personal_informations: PersonalInformationsInputType
    ): User
  }
`;

module.exports = schema;
