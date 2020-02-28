const DB = require("../../../config/database");

async function top_sellers(root, { range, limit = 5 }, { loggedAs }) {
  const FILTER_BY_RANGE =
    range && range.start && range.end
      ? `WHERE date BETWEEN CAST("${range.start}" as DATETIME) AND CAST("${range.end}" as DATETIME)`
      : "";
  const LIMIT = limit ? `LIMIT ${limit}` : "";

  const query = `
    SELECT 
      seller_name AS name,
      seller_id AS id,
      SUM(article_count) as article_count,
      SUM(amount_ttc) AS amount_ttc
    FROM 
      receipt_line
    ${FILTER_BY_RANGE}
    ${FILTER_BY_RANGE ? "AND" : "WHERE"} 
      store_id = "${loggedAs.id}"
    GROUP BY 
      seller_id
    ORDER BY 
      amount_ttc DESC
    ${LIMIT}
  `;

  return await DB.queryAsync(query);
}
module.exports = { top_sellers };
