const express = require("express");

const router = express.Router();

const gameController = require("../controllers/game.controller");

router.get("/category/:categoryId/modes", gameController.getModes);

router.post("/start", gameController.startGame);

router.post("/guess", gameController.guess);

router.get("/session/:id", gameController.getSession);

/*router.get("/category/:categoryId/entities", gameController.searchEntities);*/
module.exports = router;
