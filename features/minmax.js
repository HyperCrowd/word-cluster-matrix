module.exports = function (numbers) {
  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers)
  }
}