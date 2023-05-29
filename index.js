const epsilon = 5e-324;

class StateSpaceModel {
  constructor(A, C, Q, R, initialState, initialCovariance) {
    this.A = A; // State transition matrix
    this.C = C; // Observation matrix
    this.Q = Q; // Process noise covariance
    this.R = R; // Observation noise covariance
    this.state = initialState; // Initial state vector
    this.covariance = initialCovariance; // Initial state covariance matrix
  }

  predict() {
    // Predict the next state
    const predictedState = math.multiply(this.A, this.state);
    const predictedCovariance = math.add(
      math.multiply(
        math.multiply(this.A, this.covariance),
        math.transpose(this.A)
      ),
      this.Q
    );

    return { state: predictedState, covariance: predictedCovariance };
  }

  update(observation) {
    // Update the state based on the new observation
    const innovation = math.subtract(
      observation,
      math.multiply(this.C, this.state)
    );
    const innovationCovariance = math.add(
      math.multiply(
        math.multiply(this.C, this.covariance),
        math.transpose(this.C)
      ),
      this.R
    );

    const kalmanGain = math.multiply(
      math.multiply(this.covariance, math.transpose(this.C)),
      math.inv(innovationCovariance)
    );

    this.state = math.add(this.state, math.multiply(kalmanGain, innovation));
    this.covariance = math.multiply(
      math.subtract(
        math.identity(this.A.size()),
        math.multiply(kalmanGain, this.C)
      ),
      this.covariance
    );
  }

  stringToMatrix(words, vocabulary) {
    const wordArray = words.split(' '); // Split the string into an array of words
    const matrix = [];

    for (const word of vocabulary || wordArray) {
      const count = wordArray.filter((w) => w === word).length; // Count the occurrences of each word in the vocabulary
      matrix.push(count);
    }

    return matrix;
  }

  static createStateTransitionMatrix(sentences, timestamps) {
    const uniqueWords = new Set();
    const wordFrequencyMatrix = {};

    // Extract unique words and initialize word frequency matrix
    for (let i = 0; i < sentences.length; i++) {
      const words = sentences[i].split(' ');
      const timestamp = timestamps[i];

      for (const word of words) {
        uniqueWords.add(word);
        if (!wordFrequencyMatrix[word]) {
          wordFrequencyMatrix[word] = {};
        }
        if (!wordFrequencyMatrix[word][timestamp]) {
          wordFrequencyMatrix[word][timestamp] = epsilon;
        }
      }
    }

    // Populate word frequency matrix
    for (let i = 0; i < sentences.length; i++) {
      const words = sentences[i].split(' ');
      const timestamp = timestamps[i];

      for (const word of words) {
        wordFrequencyMatrix[word][timestamp]++;
      }
    }

    // Create state transition matrix (word frequency matrix normalized by row)
    const stateTransitionMatrix = [];
    for (const word of uniqueWords) {
      const row = [];
      const frequencyRow = wordFrequencyMatrix[word];

      // Calculate the sum of frequencies in the row
      const rowSum = Object.values(frequencyRow).reduce(
        (sum, freq) => sum + freq,
        0
      );

      // Normalize frequencies and push them to the state transition matrix row
      for (const timestamp of timestamps) {
        const frequency = frequencyRow[timestamp] || epsilon;
        row.push(frequency / rowSum);
      }

      stateTransitionMatrix.push(row);
    }

    return {
      xLegend: timestamps,
      yLegend: uniqueWords,
      matrix: math.matrix(stateTransitionMatrix),
    };
  }

  static createObservationMatrix(sentences, timestamps) {
    const uniqueWords = new Set();
    const observationMatrix = {};

    // Extract unique words and initialize observation matrix
    for (let i = 0; i < sentences.length; i++) {
      const words = sentences[i].split(' ');
      const timestamp = timestamps[i];

      for (const word of words) {
        uniqueWords.add(word);
        if (!observationMatrix[word]) {
          observationMatrix[word] = {};
        }
        if (!observationMatrix[word][timestamp]) {
          observationMatrix[word][timestamp] = epsilon;
        }
      }
    }

    // Populate observation matrix
    for (let i = 0; i < sentences.length; i++) {
      const words = sentences[i].split(' ');
      const timestamp = timestamps[i];

      for (const word of words) {
        observationMatrix[word][timestamp]++;
      }
    }

    // Convert observation matrix to a 2D array (matrix format)
    const wordList = Array.from(uniqueWords);
    const observationMatrixArray = wordList.map((word) => {
      const row = [];
      const frequencyRow = observationMatrix[word];

      for (const timestamp of timestamps) {
        const frequency = frequencyRow[timestamp] || epsilon;
        row.push(frequency);
      }

      return row;
    });

    return {
      xLegend: timestamps,
      yLegend: uniqueWords,
      matrix: math.matrix(observationMatrixArray),
    };
  }
}

// Example usage:
const math = require('mathjs'); // Import a math library for matrix operations

const sentences = ['I love to code', 'Coding is fun', 'Code is life'];
const timestamps = [1, 2, 3];

// State transition matrix
// The state equation describes the evolution of the underlying state variables over time.
const A = StateSpaceModel.createStateTransitionMatrix(
  sentences,
  timestamps
).matrix;

// Observation matrix
// The observed data at each time point can be denoted as y(t), representing the frequency of a specific word occurring at time t.
const C = StateSpaceModel.createObservationMatrix(sentences, timestamps).matrix;

const dimensions = A._size;
const height = dimensions[0];
const width = dimensions[1];

function getZeroMatrix(height, width) {
  return math.matrix(math.zeros([height, width]));
}

function getDiagMatrix(size) {
  const onesArray = Array(size).fill(1);
  return math.matrix(math.diag(onesArray));
}

function squarify(matrix) {
  const dimensions = matrix._size;
  const newDimensions =
    dimensions[0] > dimensions[1]
      ? [dimensions[0], dimensions[0]]
      : [dimensions[1], dimensions[1]];

  return math.resize(matrix, newDimensions);
}

// Process noise covariance
const Q = getZeroMatrix(height, width);

// Observation noise covariance
const R = getZeroMatrix(height, width);

// representing your initial beliefs or knowledge about the state variables.
const initialState = getZeroMatrix(height, width);
const initialCovariance = getDiagMatrix(height > width ? height : width);

// Create an instance of the state-space model
const model = new StateSpaceModel(
  squarify(A),
  squarify(C),
  squarify(Q),
  squarify(R),
  squarify(initialState),
  squarify(initialCovariance)
);

// Perform prediction and update steps
const prediction = model.predict();
const observation = squarify(getZeroMatrix(height, width));
model.update(observation);

console.log('Predicted state:', prediction.state.toString());
console.log('Updated state:', model.state.toString());
