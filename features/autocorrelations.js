module.exports = function (numbers) {
  const n = numbers.length;
  const mean = numbers.reduce((acc, num) => acc + num, 0) / n;
  const deviations = numbers.map((num) => num - mean);

  const autocorrelation = [];

  for (let lag = 0; lag < n; lag++) {
    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n - lag; i++) {
      numerator += deviations[i] * deviations[i + lag];
      denominator += deviations[i] * deviations[i];
    }

    autocorrelation.push(numerator / denominator);
  }

  return autocorrelation;
}