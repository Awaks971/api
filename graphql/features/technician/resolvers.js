const DB = require("../../../config/database");
const uuid = require("uuid/v4");

async function technicians(root, args, context) {
  const awaks_technicians = await DB.queryAsync(
    `SELECT id, firstname, email, phone, lastname, status, created_at FROM technician`
  );

  return awaks_technicians;
}

async function add_technician(root, { technician }, context) {
  const { firstname, lastname, email, phone } = technician;
  const id = uuid();

  await DB.queryAsync(
    ` INSERT INTO 
           technician (id, firstname, lastname, email, phone, created_at, status) 
        VALUE ("${id}", "${firstname}", "${lastname}", "${email}", "${phone}", CURRENT_DATE(), "1")
      `
  );

  return { ...technician, id };
}

async function disable_technician(root, { technicianId, status }, context) {
  const disabled_technician = await DB.queryAsync(
    `UPDATE technician SET status="${status}" WHERE id="${technicianId}"`
  );

  return disabled_technician;
}

module.exports = { technicians, add_technician, disable_technician };
