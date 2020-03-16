const DB = require("../config/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { AWAKS_JWT_SECRET_KEY } = process.env;

async function login(req, res, next) {
  console.log("DEBUG: Start");
  const { credentials } = req.body;

  const [user] = await DB.queryAsync(
    `SELECT * FROM user WHERE email="${credentials.email}";`
  );
  console.log("DEBUG: Check user passed");

  //   // Verify if user exist
  if (user === undefined) {
    res.status(401).json({
      message: `No user found with this email: ${credentials.email}`,
      error_code: "USER_NOT_FOUND"
    });
    res.end();
    return;
  }

  console.log("DEBUG: Found a user");

  //   // Verify his password
  const passwordIsValid = await bcrypt.compare(
    credentials.password,
    user.crypted_password
  );
  if (!passwordIsValid) {
    res.status(403).json({
      message: `Bad password`,
      error_code: "BAD_PASSWORD"
    });
    res.end();
    return;
  }
  console.log("DEBUG: Bad password passed");

  // Get all user companies
  const fetched_companies = await DB.queryAsync(
    `SELECT name, id, address, postal_code, city, phone, siret FROM store WHERE company_id="${user.company_id}";`
  );

  console.log("DEBUG: Get companies");

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

  console.log("DEBUG: Middle");

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

  console.log("DEBUG: api key created");

  // Remove password from user in database
  delete user.crypted_password;

  user.token = token;
  user.companies = companies;
  user.loggedAs = companies[0];
  res.json(user);

  console.log("DEBUG: next");

  next();
}

module.exports = login;
