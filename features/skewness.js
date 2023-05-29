module.exports = function (numbers, standardDeviation, mean) {
  return (numbers.reduce((acc, num) => acc + Math.pow(num - mean, 3), 0) /
      (numbers.length * Math.pow(standardDeviation, 3))) || 0; 
}