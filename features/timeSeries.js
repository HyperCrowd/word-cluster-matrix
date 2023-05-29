module.exports = function (numbers, windowSize = 10) {
  const rollingMean = [];
  const rollingStdDev = [];
  const rollingCorrelations = [];

  for (let i = 0; i < numbers.length; i++) {
    const window = numbers.slice(Math.max(0, i - windowSize + 1), i + 1);

    // Calculate rolling mean
    const mean = window.reduce((sum, num) => sum + num, 0) / window.length;
    rollingMean.push(mean);

    // Calculate rolling standard deviation
    const squaredDifferences = window.map((num) => Math.pow(num - mean, 2));
    const variance = squaredDifferences.reduce((sum, num) => sum + num, 0) / window.length;
    const stdDev = Math.sqrt(variance);
    rollingStdDev.push(stdDev);

    // Calculate rolling correlations with neighboring values
    const currentNum = numbers[i];
    const prevNum = i > 0 ? numbers[i - 1] : null;
    const correlation = prevNum !== null ? calculateCorrelation(window, currentNum, prevNum) : null;
    rollingCorrelations.push(correlation || 0);
  }

  return { rollingMean, rollingStdDev, rollingCorrelations };
}

function calculateCorrelation(window, currentNum, prevNum) {
  const windowWithoutCurrent = window.filter((num) => num !== currentNum);
  const windowWithoutPrev = window.filter((num) => num !== prevNum);

  const meanWithoutCurrent = windowWithoutCurrent.reduce((sum, num) => sum + num, 0) / windowWithoutCurrent.length;
  const meanWithoutPrev = windowWithoutPrev.reduce((sum, num) => sum + num, 0) / windowWithoutPrev.length;

  const numerator = windowWithoutCurrent.reduce((sum, num, index) => sum + (num - meanWithoutCurrent) * (windowWithoutPrev[index] - meanWithoutPrev), 0);
  const denominator =
    Math.sqrt(
      windowWithoutCurrent.reduce((sum, num) => sum + Math.pow(num - meanWithoutCurrent, 2), 0) *
        windowWithoutPrev.reduce((sum, num) => sum + Math.pow(num - meanWithoutPrev, 2), 0)
    ) || 1;

  return numerator / denominator;
}