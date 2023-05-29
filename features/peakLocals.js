module.exports = function (numbers) {
  let maximaCount = 0;
  let minimaCount = 0;

  for (let i = 1; i < numbers.length - 1; i++) {
    if (numbers[i] > numbers[i - 1] && numbers[i] > numbers[i + 1]) {
      maximaCount++;
    }
  }

  for (let i = 1; i < numbers.length - 1; i++) {
    if (numbers[i] < numbers[i - 1] && numbers[i] < numbers[i + 1]) {
      minimaCount++;
    }
  }

  return {
    maxima: maximaCount,
    minima: minimaCount
  }
}