const DB = require("../../../config/database");
const months = {
  january: "Janvier",
  february: "Février",
  march: "Mars",
  april: "Avril",
  may: "Mai",
  june: "Juin",
  july: "Juillet",
  august: "Aout",
  september: "Septembre",
  october: "Octobre",
  november: "Novembre",
  december: "Décembre"
};
async function receipt(root, { id }, { loggedAs }) {
  const [receipt] = await DB.queryAsync(`
    SELECT 
      * 
    FROM 
      receipt_head 
    WHERE 
    store_id="${loggedAs.id}" 
    AND 
      id="${id}"
  `);

  return receipt;
}

async function receipts(root, { cash_journal_id }, { loggedAs }) {
  const receipts = await DB.queryAsync(`
    SELECT 
      id, date, receipt_number, amount_ttc, profit, article_count, line_count, cash_journal_id
    FROM 
      receipt_head 
    WHERE 
      cash_journal_id="${cash_journal_id}"
    AND 
      store_id="${loggedAs.id}"
  `);

  return receipts;
}

async function receipt_lines({ id: receipt_id }, args) {
  const lines = await DB.queryAsync(`
    SELECT
      label, label_extra, vat_rate, amount_ttc, id, article_count
    FROM 
      receipt_line 
    WHERE 
      receipt_id="${args.receipt_id || receipt_id}"
  `);

  return lines;
}

async function receipt_vat({ id: receipt_id }, args) {
  const group = await DB.queryAsync(`
    SELECT 
      amount_vat, vat_rate, SUM(amount_ht) as amount_ht, SUM(amount_vat) as amount_vat
    FROM 
      receipt_line 
    WHERE 
      receipt_id="${receipt_id}" 
    GROUP BY 
      vat_rate
  `);

  const payment_mode =
    (await DB.queryAsync(`
    SELECT
      payment_journal.payment_label AS label,
      payment_journal.paid_amount AS paid_amount,
      payment_journal.returned_amount AS returned_amount
    FROM
      payment_journal,
      receipt_head
    WHERE
      payment_journal.receipt_id = "${receipt_id}" 
    AND
      receipt_head.id = "${receipt_id}"
    GROUP BY
      payment_label
  `)) || [];

  const total_ht = group
    .reduce((acc, { amount_ht }) => acc + amount_ht, 0)
    .toFixed(2);
  const total_vat = group
    .reduce((acc, { amount_vat }) => acc + amount_vat, 0)
    .toFixed(2);

  return { group, total_ht, total_vat, payment_mode };
}

async function articles_stats(
  _,
  { range, limit, start_at, order_by },
  { loggedAs }
) {
  const FILTER_BY_RANGE =
    range && range.start && range.end
      ? `WHERE date BETWEEN "${range.start}" AND "${range.end}"`
      : "";

  const LIMIT = limit ? `LIMIT ${limit}` : "";
  const START_AT = start_at ? `OFFSET ${start_at}` : "";
  const ORDER_BY = order_by ? `ORDER BY ${order_by} DESC` : "";

  const stats = await DB.queryAsync(`
    SELECT 
      TRIM(label) AS label,
      ROUND(SUM(profit), 2) AS profit,
      ROUND(SUM(amount_ttc), 2) AS amount_ttc,
      SUM(article_count) AS article_count,
      article_id
    FROM 
      receipt_line
    ${FILTER_BY_RANGE}  
    ${FILTER_BY_RANGE ? "AND" : "WHERE"} 
      store_id = "${loggedAs.id}"
    GROUP BY 
      article_id, 
      label
    ${ORDER_BY}
    ${LIMIT}
    ${START_AT}
  `);

  return stats;
}

async function top_families(root, { range, limit }, { loggedAs }) {
  const FILTER_BY_RANGE =
    range && range.start && range.end
      ? `WHERE date BETWEEN cast("${range.start}" as datetime) AND cast("${range.end}" as datetime)`
      : "";
  const LIMIT = limit ? `LIMIT ${limit}` : "";

  const query = `
    SELECT 
      family_label AS label,
      family_id AS id,
      SUM(article_count) as article_count,
      ROUND(SUM(amount_ttc), 2) AS amount_ttc,
      ROUND(SUM(amount_ht), 2) AS amount_ht,
      ROUND(SUM(profit), 2) AS profit,
      vat_rate,
      ROUND(SUM(amount_vat), 2) as amount_vat
    FROM 
      receipt_line
    ${FILTER_BY_RANGE}
    ${FILTER_BY_RANGE ? "AND" : "WHERE"} 
      store_id = "${loggedAs.id}"
    GROUP BY 
      family_id
    ORDER BY 
      amount_ttc DESC
    ${LIMIT}
  `;

  return await DB.queryAsync(query);
}

async function top_month(root, { range }, { loggedAs }) {
  const amounts = await DB.queryAsync(`
    SELECT
      SUM(amount_ttc) AS amount_ttc,
      SUM(amount_ht) AS amount_ht,
      MONTHNAME(date) AS month,
      YEAR(date) as year
    FROM
      receipt_line
    WHERE YEAR(date)=${range} 
    
    AND store_id="${loggedAs.id}"
     
    GROUP BY 
      MONTH(date)
    ORDER BY
      YEAR(date),
      MONTH(date) 
  `);
  const payments = await DB.queryAsync(`
    SELECT
      ROUND(SUM(paid_amount), 2) AS paid_amount,
      MONTHNAME(date) AS month,
      payment_label
    FROM
      payment_journal
    WHERE YEAR(date)=${range} 
    AND
      store_id="${loggedAs.id}"
    GROUP BY MONTH(date), payment_label
  `);

  const clean_payload = amounts.map(amount => ({
    year: amount.year,
    month: months[amount.month.toLowerCase()],
    amount_ht: amount.amount_ht,
    amount_ttc: amount.amount_ttc,
    payments: payments
      .map(({ payment_label, paid_amount, ...pay }) => {
        if (amount.month.toLowerCase() === pay.month.toLowerCase()) {
          return { payment_label, paid_amount };
        } else {
          return;
        }
      })
      .filter(pay => !!pay)
  }));

  return clean_payload;
}

async function total_payment_by_year(root, { range }, { loggedAs }) {
  const total = await DB.queryAsync(`
  SELECT
      ROUND(SUM(paid_amount), 2) AS paid_amount,
      payment_label
    FROM
      payment_journal
    WHERE
    	YEAR(date)=${range}
    AND  store_id="${loggedAs.id}"
    GROUP BY payment_label`);

  return total;
}

async function get_years_on_receipt(root, { cash_journal_id }, { loggedAs }) {
  const years = await DB.queryAsync(`
  SELECT YEAR(DATE) AS year
  FROM receipt_line 
  WHERE store_id="${loggedAs.id}" 
  GROUP BY YEAR(DATE) 
  ORDER BY YEAR(DATE)`);

  return years;
}

module.exports = {
  receipt,
  receipts,
  receipt_vat,
  receipt_lines,
  articles_stats,
  top_families,
  get_years_on_receipt,
  top_month,
  total_payment_by_year
};
