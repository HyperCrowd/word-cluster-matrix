const math = require('mathjs'); // Import a math library for matrix operations
const natural = require('natural');
const { removeStopwords } = require('stopword');
const pluralize = require('pluralize');
const { PNG } = require('pngjs');
const fs = require('fs');
const getFeatures = require('./features');

const tokenizer = new natural.WordTokenizer();

const maxSize = 101
const colorMappings = [
  { temperature: 0, color: [0, 0, 0] },         // Black for lowest temperature
  { temperature: 0.25, color: [0, 0, 255] },    // Blue for low temperature
  { temperature: 0.5, color: [0, 255, 255] },   // Cyan for medium temperature
  { temperature: 0.75, color: [255, 255, 0] },  // Yellow for high temperature
  { temperature: 1, color: [255, 0, 0] },       // Red for highest temperature
];

class GrammarField {

  /**
   *
   */
  constructor(sentences = [], times = []) {
    if (sentences.length !== times.length) {
      throw new RangeError('Words must be the same length as times');
    }

    this.timeSentenceMap = new Array(maxSize);
    this.uniqueWords = {};
    this.maxCluster = 0;
    this.maxMatrixValue = 0;
    this.matrix = math.sparse(math.zeros(maxSize, maxSize));
    this.featureMatrix = math.sparse(math.zeros(maxSize, 14));
    this.calculate(sentences, times)
  }

  /**
   * 
   */
  async generateFeatures (outputPath, isGreyscale = true) {
    const width = this.matrix.size()[1];
    const height = this.matrix.size()[0];
    const maxFeatures = {}
    const minFeatures = {}
    const allFeatures = []

    // Iterate over the matrix and generate features for each frequency cluster
    for (let y = 0; y < height; y++) {

      const values = []

      for (let x = 0; x < width; x++) {
        const value =
          math.subset(this.matrix, math.index(x, y));

        values.push(value)
      }

      const features = getFeatures(values, true)
      allFeatures[y] = features

      for (const feature of Object.keys(features)) {
        const value = features[feature]

        if (maxFeatures[feature] === undefined) {
          maxFeatures[feature] = value
        }

        if (minFeatures[feature] === undefined) {
          minFeatures[feature] = value
        }

        if (value > maxFeatures[feature]) {
          maxFeatures[feature] = value
        }

        if (value < minFeatures[feature]) {
          minFeatures[feature] = value
        }
      }
    }

    // Calculate features gradients
    //   rows are features
    //   columns are time

    for (let y = 0; y < height; y++) {
      const features = allFeatures[y]
      let x = 0

      for (const feature of Object.keys(features)) {
        const distance = maxFeatures[feature] - minFeatures[feature] === 0
          ? 0
          :  this.calculatePercentage(
              minFeatures[feature],
              maxFeatures[feature],
              features[feature]
            );

        this.featureMatrix = math.subset(
          this.featureMatrix,
          math.index(x, y),
          distance
        );

        x += 1
      }
    }

    return this.toPng(outputPath, isGreyscale, this.featureMatrix, false)
  }

  /**
   *
   */
  calculate (sentences = [], times = []) {
    const minTime = math.min(times);
    const maxTime = math.max(times);

    // Prepare word-sentence indexes
    let sentenceIndex = 0;

    for (const sentence of sentences) {
      if (sentence === undefined) {
        continue
      }

      // Remove all stop words and lower case each word
      const words = removeStopwords(tokenizer.tokenize(sentence.toLowerCase()));

      for (const baseWord of words) {
        if (baseWord === '') {
          continue
        }

        // Singularize all words to make context easier to group
        const word = pluralize.singular(baseWord)

        if (this.uniqueWords[word] === undefined) {
          this.uniqueWords[word] = {
            count: 0,
            sentences: [],
            word
          };
        }

        // We identify the unique word, count how many times it has appeared, and what sentences it has been found in
        this.uniqueWords[word].count += 1;
        this.uniqueWords[word].sentences.push(sentenceIndex);

        // We update the size of the largest unique word cluster
        if (this.uniqueWords[word].count > this.maxCluster) {
          this.maxCluster = this.uniqueWords[word].count;
        }
      }

      sentenceIndex += 1;
    }

    // Prepare time-sentence indexes with simple percentage differences
    sentenceIndex = 0;
    for (const time of times) {
      if (time === undefined) {
        continue
      }

      const timeIndex = this.calculatePercentage(minTime, maxTime, time);

      if (this.timeSentenceMap[timeIndex] === undefined) {
        this.timeSentenceMap[timeIndex] = [];
      }

      this.timeSentenceMap[timeIndex].push(sentenceIndex);

      sentenceIndex += 1;
    }

    const uniqueWords = Object.values(this.uniqueWords);
    let timeIndex = 0;

    // Iterate through all time-sentence indexes
    for (const timeSentence of this.timeSentenceMap) {
      if (timeSentence === undefined) {
        // No time-sentence index found here, move on
        timeIndex += 1;
        continue;
      }

      // Iterate through each sentence within the time-sentence map (Each one a single row of pixels in the final image)
      for (const sentenceIndex of timeSentence) {
        // Iterate through every unique word
        for (const uniqueWord of uniqueWords) {
          // Select words that appear in this sentence
          if (uniqueWord.sentences.indexOf(sentenceIndex) > -1) {
            // Get where this word appears in the cluster axis (The columns of in the final image)
            // Lower in the cluster axis (the top of the column) means less frequent and more unique words
            // Higher in the cluster axis (the bottom of the column) means more frequent and reused words
            const clusterPosition = this.calculatePercentage(
              0,
              this.maxCluster,
              uniqueWord.count
            );

            // Iterate the time/cluster
            const value = math.subset(
              this.matrix,
              math.index(timeIndex, clusterPosition)
            );

            const nextValue = value + 1

            if (nextValue > this.maxMatrixValue) {
              this.maxMatrixValue = nextValue;
            }

            this.matrix = math.subset(
              this.matrix,
              math.index(timeIndex, clusterPosition),
              nextValue
            );
          }
        }
      }
      timeIndex += 1;
    }
  }

  /**
   *
   */
  calculatePercentage(start, end, position) {
    const percentage = ((position - start) / (end - start)) * 100;
    return Math.floor(percentage);
  }

  /**
   *
   */
  toPng(outputPath, isGreyscale = true, matrix = this.matrix, needsNormalization = true) {
    // Define image dimensions based on matrix size
    const width = matrix.size()[1];
    const height = matrix.size()[0];

    // Create a new PNG instance
    const png = new PNG({ width, height });

    // Iterate over the matrix and set grayscale pixel values in the PNG image
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = needsNormalization
          ? math.subset(matrix, math.index(x, y)) / this.maxMatrixValue
          : math.subset(matrix, math.index(x, y))

        if (isGreyscale === false) {
          // Thermal iridescence
          let color = [];
          for (let i = 1; i < colorMappings.length; i++) {
            if (value <= colorMappings[i].temperature) {
              const prevColor = colorMappings[i - 1].color;
              const nextColor = colorMappings[i].color;
              const t = (value - colorMappings[i - 1].temperature) / (colorMappings[i].temperature - colorMappings[i - 1].temperature);
              color = this.interpolateColors(prevColor, nextColor, t);
              break;
            }
          }

          const idx = (width * y + x) << 2; // Calculate the index of the pixel in the PNG buffer
          png.data[idx] = color[0] || 0;     // Red channel
          png.data[idx + 1] = color[1] || 0; // Green channel
          png.data[idx + 2] = color[2] || 0; // Blue channel
          png.data[idx + 3] = 255;      // Alpha channel (fully opaque)
        } else {
          // Greyscale only
          const intensity = Math.floor(value * 255);
          const idx = (width * y + x) << 2; // Calculate the index of the pixel in the PNG buffer
          png.data[idx] = intensity; // Red channel
          png.data[idx + 1] = intensity; // Green channel
          png.data[idx + 2] = intensity; // Blue channel
          png.data[idx + 3] = 255; // Alpha channel (fully opaque)
        }
      } 
    }

    const writableStream = fs.createWriteStream(outputPath);

    return new Promise((resolve) => {
      writableStream.on('finish', () => {
        resolve(png); // Resolve the promise when the stream finishes
      });

      // Save the PNG image to a file
      png.pack().pipe(writableStream);
    });
  }

  /**
   * 
   */
  interpolateColors(color1, color2, t) {
    const r = Math.round(color1[0] + (color2[0] - color1[0]) * t);
    const g = Math.round(color1[1] + (color2[1] - color1[1]) * t);
    const b = Math.round(color1[2] + (color2[2] - color1[2]) * t);
    return [r, g, b];
  }
}

module.exports = GrammarField;
