// .js

module.exports = function (numbers) {
  const n = numbers.length;

  // Calculate sum of x, y, and x^2
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;

  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += numbers[i];
    sumXY += i * i;
  }

  // Calculate linear regression coefficients
  const slope = (n * sumXY - sumX * sumY) / (n * sumXY - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { trendSlope: slope, trendIntercept: intercept };
}