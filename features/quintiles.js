module.exports = function (numbers) {
  const sortedNumbers = numbers.slice().sort((a, b) => a - b);
  const quintiles = [];

  for (let i = 1; i <= 4; i++) {
    const index = i * (sortedNumbers.length + 1) / 5 - 1;
    const lowerIndex = Math.floor(index);
    const upperIndex = Math.ceil(index);

    if (lowerIndex === upperIndex) {
      quintiles.push(sortedNumbers[lowerIndex]);
    } else {
      const lowerValue = sortedNumbers[lowerIndex];
      const upperValue = sortedNumbers[upperIndex];
      const fraction = index - lowerIndex;
      const interpolatedValue = lowerValue + (upperValue - lowerValue) * fraction;
      quintiles.push(interpolatedValue);
    }
  }

  return quintiles;
}