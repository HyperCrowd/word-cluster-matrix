module.exports = function (numbers, mean) {
  const squaredDifferencesSum = numbers.reduce((acc, num) => {
    const diff = num - mean;
    return acc + diff * diff;
  }, 0);
  const variance = squaredDifferencesSum / numbers.length;
  return Math.sqrt(variance); 
}