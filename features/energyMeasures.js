module.exports = function (numbers) {
// Calculate total energy
  const totalEnergy = numbers.reduce((sum, num) => sum + num * num, 0);

  // Calculate sum of squared values
  const sumOfSquaredValues = numbers.reduce((sum, num) => sum + num, 0) ** 2;

  return { totalEnergy, sumOfSquaredValues };
}