async function userCompanies(_, args, { userCompanies: companies }) {
  return companies;
}

module.exports = { userCompanies };
