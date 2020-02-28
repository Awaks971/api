const DB = require("../../../config/database");
const bcrypt = require("bcryptjs");
const uuid = require("uuid/v4");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const { AWAKS_JWT_SECRET_KEY, AWAKS_TPV_WEBSERVICE_URI } = process.env;

async function me(root, args, { userId }) {
  const [user] = await DB.queryAsync(`SELECT * FROM user WHERE id="${userId}"`);

  if (user === undefined) {
    throw new Error(`No user found with this userId: ${userId}`);
  }

  return user;
}

async function users(root, args, { userId }) {
  const user = await DB.queryAsync(`SELECT * FROM user`);

  return user;
}

async function disable_user(root, { status, userId }) {
  const user = await DB.queryAsync(
    `UPDATE user SET status="${status}" WHERE id="${userId}"`
  );

  return user;
}
async function finish_register(root, { user }, { userId }) {
  const { email, firstname, lastname, new_password } = user;

  const new_crypted_password = await bcrypt.hash(new_password, 10);

  const patched_user = await DB.queryAsync(
    `UPDATE user SET
      email="${email}",
      firstname="${firstname}",
      lastname="${lastname}",
      crypted_password="${new_crypted_password}"
    WHERE id="${userId}"`
  );

  return user;
}

async function valid_user(root, { userId, company_id }) {
  await axios.post(`${AWAKS_TPV_WEBSERVICE_URI}/valid-user`, {
    userId,
    company_id
  });
}

async function register(root, { credentials }, context) {
  const { firstname, lastname, email, password } = credentials;
  if (!email || !password) {
    throw new Error("Register must provide an email and password");
  }

  if (!firstname || !lastname) {
    throw new Error("Register must provide an firstname and lastname");
  }

  // Hash password before creation
  const hashmdp = await bcrypt.hash(credentials.password, 10);

  // Generate UUID
  const userId = uuid.v4();

  // Create user
  await DB.queryAsync(`
    INSERT INTO
        users (id, email, crypted_password, firstname, lastname)
    VALUES ("${userId}","${email}","${hashmdp}","${firstname}","${lastname}");
`);

  return {
    id: userId,
    email
  };
}

async function switch_company(root, { company }, { ...context }) {
  const cleanContext = {
    ...context,
    loggedAs: company
  };

  const newToken = jwt.sign(cleanContext, AWAKS_JWT_SECRET_KEY, {
    expiresIn: "30d"
  });

  cleanContext.token = newToken;

  return cleanContext;
}

module.exports = {
  me,
  register,
  switch_company,
  users,
  disable_user,
  valid_user,
  finish_register
};
