module.exports = function (numbers, standardDeviation, mean) {
  return (numbers.reduce((acc, num) => acc + Math.pow(num - mean, 4), 0) /
      (numbers.length * Math.pow(standardDeviation, 4))) || 0;
}