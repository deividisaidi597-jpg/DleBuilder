const express = require("express");

const router = express.Router();

const controller = require("../controllers/category.controller");

router.get("/:id/config", controller.getCategoryConfig);

module.exports = router;
