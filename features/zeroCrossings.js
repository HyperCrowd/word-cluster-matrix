module.exports = function (numbers) {
  let count = 0;

  for (let i = 1; i < numbers.length; i++) {
    if ((numbers[i] >= 0 && numbers[i - 1] < 0) || (numbers[i] < 0 && numbers[i - 1] >= 0)) {
      count++;
    }
  }

  return count;
}