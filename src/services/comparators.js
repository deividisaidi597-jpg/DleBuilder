function exact(targetValue, guessValue) {
  return targetValue === guessValue ? "correct" : "wrong";
}

function array(targetValue = [], guessValue = []) {
  const intersection = targetValue.filter((item) => guessValue.includes(item));

  if (!intersection.length) {
    return "wrong";
  }

  const isExact =
    intersection.length === targetValue.length &&
    targetValue.length === guessValue.length;

  return isExact ? "correct" : "partial";
}

function number(targetValue, guessValue) {
  if (targetValue === guessValue) {
    return "correct";
  }

  return targetValue > guessValue ? "higher" : "lower";
}

module.exports = {
  exact,
  array,
  number,
};
