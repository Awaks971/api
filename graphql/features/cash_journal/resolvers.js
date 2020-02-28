const DB = require("../../../config/database");

async function cash_journals(
  root,
  {
    group_by_day,
    order_ASC,
    order_DESC,
    amount_ttc_sum,
    receipt_sum,
    amount_ht_sum,
    group_by_company = true,
    range = null
  },
  { loggedAs }
) {
  let SQLQuery = "";
  const SUM_TTC = amount_ttc_sum ? ", SUM(amount_ttc) AS amount_ttc" : "";
  const SUM_BILL = receipt_sum ? ", SUM(receipt_count) AS receipt_count" : "";

  const SUM_HT = amount_ht_sum ? ", SUM(amount_ht) AS amount_ht" : "";
  const ODER_ASC = order_ASC ? "ORDER BY date ASC" : "";
  const ODER_DESC = order_DESC ? "ORDER BY date DESC" : "";
  const GROUP_BY_DAY = group_by_day ? "GROUP BY date" : "";
  const GROUP_BY_COMPANY = group_by_company
    ? `WHERE cash_journal.store_id="${loggedAs.id}" `
    : "";
  const FILTER_BY_RANGE =
    range && range.start && range.end
      ? `${group_by_company ? "AND" : "WHERE"} 
	        date BETWEEN cast("${range.start}" as datetime) AND cast("${
          range.end
        }" as datetime)`
      : "";

  SQLQuery = ` 
    SELECT 
     date,
     receipt_count,
     id,  
     basket_median,
     canceled_lines,
     profit_amount,
     amount_ttc
     ${SUM_TTC} ${SUM_HT} ${SUM_BILL}
    FROM cash_journal 
    ${GROUP_BY_COMPANY}
    ${FILTER_BY_RANGE}
    ${GROUP_BY_DAY} 
    ${ODER_ASC}
    ${ODER_DESC}
`;
  const journals = await DB.queryAsync(SQLQuery);
  return journals;
}

async function cash_journal(root, args, { loggedAs }) {
  const [cash_journal] = await DB.queryAsync(
    `SELECT date, id FROM cash_journal WHERE store_id="${loggedAs.id}" AND id="${args.id}"`
  );

  return cash_journal;
}

module.exports = { cash_journals, cash_journal };
