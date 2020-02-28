const DB = require("../../../config/database");

async function top_payment_mode(_, { range }, { loggedAs }) {
  const FILTER_BY_RANGE =
    range && range.start && range.end
      ? `WHERE date BETWEEN "${range.start}" AND "${range.end}"`
      : "";

  const payment_mode = await DB.queryAsync(`
    SELECT 
        SUM(paid_amount) AS amount,
        payment_label AS label
    FROM 
        payment_journal 
    ${FILTER_BY_RANGE}
    ${FILTER_BY_RANGE ? "AND" : "WHERE"} 
        store_id="${loggedAs.id}"
    GROUP BY 
        payment_label

  `);

  return payment_mode;
}

module.exports = {
  top_payment_mode
};
