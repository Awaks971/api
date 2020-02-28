const {
  me,
  switch_company,
  register,
  users,
  disable_user,
  valid_user,
  finish_register
} = require("./features/user/resolvers");
const {
  cash_journals,
  cash_journal
} = require("./features/cash_journal/resolvers");
const {
  technicians,
  add_technician,
  disable_technician
} = require("./features/technician/resolvers");
const { userCompanies } = require("./features/company/resolvers");
const { pagination } = require("./features/pagination/resolvers");
const { top_payment_mode } = require("./features/payment_journal/resolvers");
const { top_sellers } = require("./features/employe/resolvers");
const {
  receipt,
  receipts,
  receipt_lines,
  receipt_vat,
  articles_stats,
  top_families
} = require("./features/receipt/resolvers");

const resolvers = {
  User: {
    companies: userCompanies
  },
  Receipt: {
    lines: receipt_lines,
    vat: receipt_vat
  },
  Query: {
    me: me,
    cash_journals: cash_journals,
    cash_journal: cash_journal,
    technicians: technicians,
    receipt: receipt,
    receipts: receipts,
    articles_stats: articles_stats,
    users: users,
    pagination: pagination,
    top_families: top_families,
    top_sellers: top_sellers,
    top_payment_mode: top_payment_mode
  },

  Mutation: {
    register: register,
    switch_company: switch_company,
    add_technician: add_technician,
    disable_technician: disable_technician,
    disable_user: disable_user,
    valid_user: valid_user,
    finish_register: finish_register
  }
};

module.exports = resolvers;
