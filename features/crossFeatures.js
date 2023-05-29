module.exports = function (numbers) {
  const pairwiseProducts = [];
  const ratiosBetweenElements = []

  // Calculate pairwise products
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const product = numbers[i] * numbers[j];
      pairwiseProducts.push(product);
    }
  }

  // Calculate ratios between elements
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      const ratio = numbers[i] / numbers[j];
      ratiosBetweenElements.push(ratio);
    }
  }

  return {
  	 pairwiseProducts,
  	 ratiosBetweenElements
  };
}