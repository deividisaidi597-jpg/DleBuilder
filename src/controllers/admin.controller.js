const Category = require("../models/Category");
const Entity = require("../models/Entity");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    return res.status(201).json(category);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    return res.json(category);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find().lean();

  res.json(categories);
};

exports.getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id).lean();

  res.json(category);
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    await Category.findByIdAndDelete(id);

    return res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createEntity = async (req, res) => {
  try {
    const entity = await Entity.create(req.body);

    res.status(201).json(entity);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getEntities = async (req, res) => {
  try {
    const filter = {};

    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }

    const entities = await Entity.find(filter)
      .sort({ name: 1, createdAt: 1 })
      .lean();

    res.json(entities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getEntityById = async (req, res) => {
  try {
    const entity = await Entity.findById(req.params.id).lean();

    if (!entity) {
      return res.status(404).json({
        message: "Entity não encontrada",
      });
    }

    res.json(entity);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateEntity = async (req, res) => {
  try {
    const entity = await Entity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(entity);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteEntity = async (req, res) => {
  try {
    await Entity.findByIdAndDelete(req.params.id);

    res.json({
      message: "Excluído",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
