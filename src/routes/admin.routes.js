const express = require("express");

const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");

const adminController = require("../controllers/admin.controller");

// CATEGORY

router.post("/category", adminAuth, adminController.createCategory);

router.get("/category", adminController.getCategories);

router.get("/category/:id", adminController.getCategory);

router.put("/category/:id", adminAuth, adminController.updateCategory);

router.patch("/category/:id", adminAuth, adminController.updateCategory);

router.delete("/category/:id", adminAuth, adminController.deleteCategory);

// ENTITY

router.post("/entity", adminAuth, adminController.createEntity);

router.get("/entity", adminController.getEntities);

router.get("/entity/:id", adminController.getEntityById);

router.patch("/entity/:id", adminAuth, adminController.updateEntity);

router.delete("/entity/:id", adminAuth, adminController.deleteEntity);

module.exports = router;
