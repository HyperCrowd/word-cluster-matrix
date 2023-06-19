const brain = require('brain.js');
const { LSTMTimeStep } = brain.recurrent;


const net = new brain.NeuralNetwork();

net.train([
  { input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 } },
  { input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 } },
  { input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 } },
]);

class Predict {
  constructor (inputSize = 2, hiddenLayers = 10, outputSize = 2) {
    this.net = new LSTMTimeStep({
      inputSize,
      hiddenLayers: [hiddenLayers],
      outputSize
    });
  }

  /**
   * 
   */
  train (errorThresh = 0.09, trainingData = [
    [
      [1, 5],
      [2, 4],
      [3, 3],
      [4, 2],
      [5, 1],
    ],
  ]) {
    this.net.train(trainingData, { log: true, errorThresh });
  }

  /**
   * 
   */
  feed (values = [
    [1, 5],
    [2, 4],
    [3, 3],
    [4, 2],
  ]) {
    this.net.run(values)
  }

  /**
   * 
   */
  forecast (values = [
    [1, 5],
    [2, 4],
  ], number = 3) {
    const result = this.net.forecast(values, number)
    return result
  }
}

const a = new Predict()
a.train()
a.feed()
const result = a.forecast()
console.log(result)

new Predict(102, 102, )
module.exports = Predict
