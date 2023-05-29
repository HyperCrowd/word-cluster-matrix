module.exports = function (numbers) {
  // Calculate the rate of rise
  const maxIndex = numbers.findIndex((num) => num === Math.max(...numbers));
  const rise = numbers[maxIndex] - numbers[0];
  const rateOfRise = maxIndex === 0
    ? 0
    : rise / maxIndex;

  // Calculate the rate of decay
  const lastIndex = numbers.length - 1;
  const decay = numbers[lastIndex] - numbers[maxIndex];
  const rateOfDecay = lastIndex - maxIndex === 0
    ? 0
    : decay / (lastIndex - maxIndex);

  return { rateOfRise, rateOfDecay };
}