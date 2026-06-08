const comparators = require("../comparators");

function compareClassic(category, target, guess) {
  const result = {};

  for (const attribute of category.attributes) {
    const key = attribute.key;

    const comparator = comparators[attribute.comparison];

    if (!comparator) {
      result[key] = "wrong";
      continue;
    }

    result[key] = comparator(target.attributes?.[key], guess.attributes?.[key]);
  }

  return result;
}

module.exports = {
  compareClassic,
};
