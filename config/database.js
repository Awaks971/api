const mysql = require("mysql");

const {
  AWAKS_MYSQL_HOST,
  AWAKS_MYSQL_PORT,
  AWAKS_MYSQL_USER,
  AWAKS_MYSQL_PASSWORD,
  AWAKS_MYSQL_DATABASE
} = process.env;

/**
 * Create pool connection with the MySQL database
 * Using environment variables to dynamically set credentials
 */

const pool = mysql.createPool({
  host: AWAKS_MYSQL_HOST,
  user: AWAKS_MYSQL_USER,
  password: AWAKS_MYSQL_PASSWORD,
  database: AWAKS_MYSQL_DATABASE,
  port: AWAKS_MYSQL_PORT,
  connectionLimit: 5
});

/**
 * Add queryAsync method in pool.
 * Just create a Promise when calling a MySQL query
 */

pool.queryAsync = (...args) =>
  new Promise((resolve, reject) =>
    pool.query(...args, function(err, result) {
      if (err) reject(err);
      resolve(result);
    })
  );

module.exports = pool;
