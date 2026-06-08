const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema(
  {
    playerId: {
      type: String,
      required: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    modeId: {
      type: String,
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entity",
      required: true,
    },

    attempts: [
      {
        guess: String,

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    attemptCount: {
      type: Number,
      default: 0,
    },

    hintsUnlocked: {
      type: [String],
      default: [],
    },

    finished: {
      type: Boolean,
      default: false,
    },

    winner: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("GameSession", gameSessionSchema);
