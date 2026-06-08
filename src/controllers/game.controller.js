const gameService = require("../services/game.service");

exports.startGame = async (req, res) => {
  try {
    const result = await gameService.startGame(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

exports.getModes = async (req, res) => {
  try {
    const result = await gameService.getModes(req.params.categoryId);

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

exports.getSession = async (req, res) => {
  try {
    const result = await gameService.getSession(req.params.id);

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

exports.guess = async (req, res) => {
  try {
    const result = await gameService.guess(req.body);

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

/*exports.searchEntities = async (req, res) => {
  try {
    const result = await gameService.searchEntities({
      categoryId: req.params.categoryId,
      q: req.query.q,
    });

    return res.json(result);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
};*/
