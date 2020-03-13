const DB = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const { AWAKS_JWT_SECRET_KEY, AWAKS_TPV_WEBSERVICE_URI } = process.env;

async function login(req, res, next) {
  const { credentials } = req.body;

  const [user] = await DB.queryAsync(
    `SELECT * FROM user WHERE email="${credentials.email}";`
  );

  //   // Verify if user exist
  if (user === undefined) {
    res.status(401).json({
      message: `Pas d'utilisateur: ${credentials.email}`,
      error_code: "USER_NOT_FOUND"
    });
    res.end();
    return;
  }

  if (user.login_attempts === 2) {
    return res.status(403).json({
      message: "Votre compte est bloqué",
      error_code: "LOCKED_USER_ACCOUNT"
    });
  }

  //   // Verify his password
  const passwordIsValid = await bcrypt.compare(
    credentials.password,
    user.crypted_password
  );
  if (!passwordIsValid) {
    await DB.queryAsync(
      `UPDATE user SET login_attempts="${user.login_attempts +
        1}" WHERE email="${user.email}"`
    );
    if (user.login_attempts === 1) {
      await DB.queryAsync(
        `UPDATE user SET status="locked" WHERE email="${user.email}"`
      );
      await axios.post(`${AWAKS_TPV_WEBSERVICE_URI}/lock-user-account`, {
        user
      });
      return res.status(403).json({
        message: "Votre compte est bloqué",
        error_code: "LOCKED_USER_ACCOUNT"
      });
    }
    res.status(403).json({
      message: `Mauvais mot de passe. Reste ${1 -
        user.login_attempts} essaie(s)`,
      error_code: "BAD_PASSWORD"
    });

    res.end();
    return;
  }

  // Get all user companies
  const fetched_companies = await DB.queryAsync(
    `SELECT name, id, address, postal_code, city, phone, siret FROM store WHERE company_id="${user.company_id}";`
  );

  const companies = fetched_companies.map(company => {
    return {
      id: company.id,
      name: company.name,
      phone: company.phone,
      siret: company.siret,
      address: {
        line1: company.address,
        postal_code: company.postal_code,
        city: company.city
      }
    };
  });

  // Generate new token
  const token = jwt.sign(
    {
      userId: user.id,
      userCompanies: companies,
      loggedAs: companies[0],
      role: user.role
    },
    AWAKS_JWT_SECRET_KEY,
    {
      expiresIn: "30d"
    }
  );

  // Remove password from user in database
  delete user.crypted_password;

  user.token = token;
  user.companies = companies;
  user.loggedAs = companies[0];
  res.json(user);
  next();
}

module.exports = login;
