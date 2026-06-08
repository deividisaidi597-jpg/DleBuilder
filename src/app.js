const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const gameRoutes = require("./routes/game.routes");
const categoryRoutes = require("./routes/category.routes");
const entityRoutes = require("./routes/entity.routes");
const path = require("path");
const uploadRoutes = require("./routes/upload.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/game", gameRoutes);
app.use("/category", categoryRoutes);
app.use("/entity", entityRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/upload", uploadRoutes);

module.exports = app;
