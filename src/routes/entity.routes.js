const express = require("express");
const router = express.Router();

const controller = require("../controllers/entity.controller");

router.get("/category/:categoryId/entities/search", controller.search);

module.exports = router;
