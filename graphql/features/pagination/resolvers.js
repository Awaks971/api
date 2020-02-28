const DB = require("../../../config/database");

async function pagination(_, { by, table }) {
  const [total_rows] = await DB.queryAsync(`
    SELECT
        COUNT(DISTINCT ${by}) AS total_rows
    FROM
        ${table}
  `);

  return total_rows;
}

module.exports = {
  pagination
};
