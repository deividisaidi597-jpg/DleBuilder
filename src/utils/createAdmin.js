const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

async function createAdmin() {
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });

  if (exists) return;

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await Admin.create({
    email: process.env.ADMIN_EMAIL,
    password: hashed,
  });
}

module.exports = createAdmin;
