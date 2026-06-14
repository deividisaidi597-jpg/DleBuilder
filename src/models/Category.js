const mongoose = require("mongoose");

const AttributeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    dataType: {
      type: String,
      enum: ["string", "array", "number"],
      default: "string",
    },

    comparison: {
      type: String,
      enum: ["exact", "array", "number"],
      required: true,
    },
  },
  { _id: false },
);

const GameModeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["classic", "text", "image", "emoji", "audio"],
      required: true,
    },
  },
  { _id: false },
);

const ClassicHintSchema = new mongoose.Schema(
  {
    modeId: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    backgroundImage: {
      type: String,
      default: "",
    },

    attributes: {
      type: [AttributeSchema],
      default: [],
    },

    gameModes: {
      type: [GameModeSchema],
      default: [],
    },

    classicHints: {
      type: [ClassicHintSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Category", CategorySchema);
