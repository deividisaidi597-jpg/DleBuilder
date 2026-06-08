const Category = require("../models/Category");

exports.getCategoryConfig = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        error: "Categoria não encontrada",
      });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
