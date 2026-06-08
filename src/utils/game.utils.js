function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function compareArray(a = [], b = []) {
  const intersection = a.filter((item) =>
    b.includes(item)
  );

  if (intersection.length === 0) {
    return "wrong";
  }

  if (
    intersection.length === a.length &&
    intersection.length === b.length
  ) {
    return "correct";
  }

  return "partial";
}

module.exports = {
  randomItem,
  compareArray,
};