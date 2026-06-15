const mongoose = require("mongoose");

const EntitySchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    attributes: {
      type: Object,
      default: {},
    },

    modeData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);
EntitySchema.index({ categoryId: 1 });
EntitySchema.index({ name: 1 });
module.exports = mongoose.model("Entity", EntitySchema);
