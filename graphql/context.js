const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const DB = require("../config/database");
const { AWAKS_JWT_SECRET_KEY } = process.env;

async function context({ req }) {
  const token = req.headers.authorization || "";
  const splitToken = token.split(" ")[1];
  try {
    const { userId, userCompanies, loggedAs } = jwt.verify(
      splitToken,
      AWAKS_JWT_SECRET_KEY
    );
    const [potential_logged_user] = await DB.queryAsync(
      `SELECT id FROM user WHERE id="${userId}"`
    );

    if (!potential_logged_user || !potential_logged_user.id) {
      throw new Error("Unknow user ...");
    }

    return {
      userId,
      userCompanies,
      loggedAs
    };
  } catch (e) {
    console.log(e);
    throw new AuthenticationError(
      "Authentication token is invalid, please log in"
    );
  }
}

module.exports = context;
