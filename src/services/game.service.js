const Entity = require("../models/Entity");
const Category = require("../models/Category");
const GameSession = require("../models/GameSession");
const { randomItem } = require("../utils/game.utils");
const { compareClassic } = require("./modes/classic.mode");

exports.startGame = async ({ playerId, categoryId, modeId }) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.status = 404;
    throw error;
  }

  let entities = [];

  if (modeId === "classic") {
    entities = await Entity.find({
      categoryId,
    });
  } else {
    entities = await Entity.find({
      categoryId,
      [`modeData.${modeId}`]: {
        $exists: true,
        $ne: [],
      },
    });
  }

  if (!entities.length) {
    const error = new Error("Nenhuma entidade disponível");
    error.status = 400;
    throw error;
  }

  const entity = randomItem(entities);

  const session = await GameSession.create({
    playerId,
    categoryId,
    modeId,
    entityId: entity._id,
  });

  if (modeId === "classic") {
    return {
      sessionId: session._id,
      mode: "classic",
      challenge: null,
    };
  }

  const modeItems = entity.modeData?.[modeId] || [];

  let challenge;

  if (modeId === "splash") {
    const splashes = modeItems.filter(
      (item) =>
        item.title?.toLowerCase() !== "clássica" &&
        item.title?.toLowerCase() !== "classic",
    );

    challenge = randomItem(splashes.length > 0 ? splashes : modeItems);
  } else {
    challenge = randomItem(modeItems);
  }

  return {
    sessionId: session._id,
    mode: modeId,
    challenge,
  };
};

exports.getModes = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Categoria não encontrada");
    error.status = 404;
    throw error;
  }

  return {
    categoryId: category._id,
    categoryName: category.displayName,
    modes: category.gameModes,
  };
};

exports.getSession = async (sessionId) => {
  const session = await GameSession.findById(sessionId);

  if (!session) {
    const error = new Error("Sessão não encontrada");
    error.status = 404;
    throw error;
  }

  return session;
};

exports.guess = async ({ sessionId, guess }) => {
  const session = await GameSession.findById(sessionId);

  if (!session) {
    const error = new Error("Sessão não encontrada");
    error.status = 404;
    throw error;
  }

  const targetEntity = await Entity.findById(session.entityId);

  if (!targetEntity) {
    const error = new Error("Resposta não encontrada");
    error.status = 404;
    throw error;
  }

  const category = await Category.findById(targetEntity.categoryId);

  const guessedEntity = await Entity.findOne({
    categoryId: targetEntity.categoryId,
    name: {
      $regex: new RegExp(`^${guess}$`, "i"),
    },
  });

  if (!guessedEntity) {
    const error = new Error("Entidade não encontrada");
    error.status = 404;
    throw error;
  }

  session.attempts.push({
    guess,
  });

  session.attemptCount += 1;

  const result = {
    correct:
      guessedEntity.name.toLowerCase() === targetEntity.name.toLowerCase(),

    guessedEntity: {
      id: guessedEntity._id,
      name: guessedEntity.name,
      attributes: guessedEntity.attributes,
      modeData: guessedEntity.modeData,
    },

    checks: {},

    hints: [],
  };

  result.checks = compareClassic(category, targetEntity, guessedEntity);

  if (result.correct) {
    session.finished = true;
    session.winner = true;
  }

  if (session.modeId === "classic" && !result.correct) {
    const unlockedHints = category.classicHints.filter(
      (hint) => session.attemptCount >= hint.attempts,
    );

    for (const hint of unlockedHints) {
      const modeItems = targetEntity.modeData?.[hint.modeId] || [];

      if (!modeItems.length) {
        continue;
      }

      result.hints.push({
        modeId: hint.modeId,
        label: hint.modeId,
        data: randomItem(modeItems),
      });

      if (!session.hintsUnlocked.includes(hint.modeId)) {
        session.hintsUnlocked.push(hint.modeId);
      }
    }
  }

  await session.save();

  return result;
};

exports.searchEntities = async ({ categoryId, q }) => {
  return Entity.find({
    categoryId,
    name: {
      $regex: `^${q}`,
      $options: "i",
    },
  })
    .sort({ name: 1 })
    .select("_id name modeData");
};
