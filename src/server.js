require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const createAdmin = require("./utils/createAdmin");

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("MongoDB conectado");

  await createAdmin();

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
