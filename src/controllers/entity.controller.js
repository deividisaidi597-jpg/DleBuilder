const Entity = require("../models/Entity");

exports.search = async (req, res) => {
  const { categoryId } = req.params;
  const { q } = req.query;

  const entities = await Entity.find({
    categoryId,
    name: { $regex: `^${q}`, $options: "i" },
  })
    .sort({ name: 1 })
    .select({
      _id: 1,
      name: 1,
      "modeData.splash": 1,
    })
    .lean();

  res.json(entities);
};
