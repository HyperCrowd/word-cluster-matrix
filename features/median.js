module.exports = function (numbers) {
  const sortedNumbers = numbers.slice().sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedNumbers.length / 2);

  return sortedNumbers.length % 2 === 0
    ? (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2
    : sortedNumbers[middleIndex];
}