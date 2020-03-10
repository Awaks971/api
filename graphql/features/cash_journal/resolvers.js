const DB = require("../../../config/database");

async function cash_journals(
  root,
  {
    group_by_day,
    order_ASC,
    order_DESC,
    amount_ttc_sum,
    canceled_lines_sum,
    receipt_sum,
    basket_median,
    profit_sum,
    group_by_company = true,
    range = null
  },
  { loggedAs }
) {
  let SQLQuery = "";
  const SUM_TTC = amount_ttc_sum
    ? ", ROUND(SUM(amount_ttc), 2) AS amount_ttc"
    : ", amount_ttc";
  const SUM_RECEIPT = receipt_sum
    ? ", SUM(receipt_count) AS receipt_count"
    : ", receipt_count";
  const SUM_CANCELED_LINES = canceled_lines_sum
    ? ", SUM(canceled_lines) AS canceled_lines"
    : ", canceled_lines";
  const BASKET_MEDIAN = basket_median
    ? ", ROUND(SUM(basket_median) / COUNT(basket_median), 2) AS basket_median"
    : ", basket_median";
  const PROFIT_SUM = profit_sum
    ? ", ROUND(SUM(profit_amount), 2) AS profit_amount"
    : ", profit_amount";

  const ODER_ASC = order_ASC ? "ORDER BY date ASC" : "";
  const ODER_DESC = order_DESC ? "ORDER BY date DESC" : "";
  const GROUP_BY_DAY = group_by_day ? "GROUP BY date" : "";

  const GROUP_BY_COMPANY = group_by_company
    ? `${!range ? "WHERE" : "AND"}  cash_journal.store_id="${loggedAs.id}" `
    : "";
  const FILTER_BY_RANGE =
    range && range.start && range.end
      ? `${group_by_company ? "WHERE" : "AND"} 
	        date BETWEEN "${range.start}" AND "${range.end}"`
      : "";

  SQLQuery = ` 
    SELECT 
      date,
      id
      ${SUM_TTC}
      ${SUM_RECEIPT}
      ${SUM_CANCELED_LINES}
      ${BASKET_MEDIAN}
      ${PROFIT_SUM}
    FROM cash_journal 
      ${FILTER_BY_RANGE}
      ${GROUP_BY_COMPANY}
      ${GROUP_BY_DAY} 
      ${ODER_ASC}
      ${ODER_DESC}
`;

  const journals = await DB.queryAsync(SQLQuery);

  return journals;
}

async function cash_journal(root, args, { loggedAs }) {
  const [cash_journal] = await DB.queryAsync(
    `SELECT date, id, basket_median, amount_ttc, profit_amount, article_count FROM cash_journal WHERE store_id="${loggedAs.id}" AND id="${args.id}"`
  );

  return cash_journal;
}

module.exports = { cash_journals, cash_journal };
