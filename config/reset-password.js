const DB = require("./database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function update_password(req, res) {
  const { new_password, token } = req.body;

  try {
    const { token_id, exp, email } = jwt.decode(token);
    var current_time = new Date().getTime() / 1000;

    const [potential_token] = await DB.queryAsync(
      `SELECT id, val, validity FROM tokens WHERE id="${token_id}"`
    );
    const [potential_user] = await DB.queryAsync(
      `SELECT id FROM user WHERE email="${email}"`
    );

    if (!potential_user || !potential_token) {
      res.status(401).json({ message: "Utilisateur inconnu" });
    }

    if (current_time > exp) {
      res.status(403).json({ message: "Délai expiré" });
    }

    const new_crypted_password = await bcrypt.hash(new_password, 10);

    await DB.queryAsync(
      `UPDATE user SET
            crypted_password="${new_crypted_password}"
          WHERE email="${email}"`
    );

    return res.status(200).json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = update_password;
