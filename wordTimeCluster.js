const math = require('mathjs'); // Import a math library for matrix operations
const natural = require('natural');
const { removeStopwords } = require('stopword');
const pluralize = require('pluralize');
const { PNG } = require('pngjs');
const fs = require('fs');
// const Jimp = require('jimp');

const tokenizer = new natural.WordTokenizer();

class WordTimeClusterReport {
  /**
   *
   */
  constructor(sentences = [], times = []) {
    if (sentences.length !== times.length) {
      throw new RangeError('Words must be the same length as times');
    }

    this.timeSentenceMap = new Array(101);
    this.uniqueWords = {};
    this.maxCluster = 0;
    this.maxMatrixValue = 0;

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

    // Prepare cluster distribution matrix
    this.matrix = math.sparse(math.zeros(101, 101));

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
  toPng(outputPath, matrix = this.matrix) {
    // Define image dimensions based on matrix size
    const width = matrix.size()[1];
    const height = matrix.size()[0];

    // Create a new PNG instance
    const png = new PNG({ width, height });

    // Iterate over the matrix and set grayscale pixel values in the PNG image
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value =
          math.subset(matrix, math.index(x, y)) / this.maxMatrixValue;
        const intensity = Math.floor(value * 255);
        const idx = (width * y + x) << 2; // Calculate the index of the pixel in the PNG buffer
        png.data[idx] = intensity; // Red channel
        png.data[idx + 1] = intensity; // Green channel
        png.data[idx + 2] = intensity; // Blue channel
        png.data[idx + 3] = 255; // Alpha channel (fully opaque)
      } 
    }

    const writableStream = fs.createWriteStream(outputPath);

    return new Promise((resolve) => {
      writableStream.on('finish', () => {
        resolve(); // Resolve the promise when the stream finishes
      });

      // Save the PNG image to a file
      png.pack().pipe(writableStream);
    });
  }

  /**
   * 
   */
  applyThermalIridescence(image) {
    return image
      .scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
        const red = this.bitmap.data[idx + 0];
        const green = this.bitmap.data[idx + 1];
        const blue = this.bitmap.data[idx + 2];
        
        // Apply thermal iridescence effect
        const average = (red + green + blue) / 3;
        this.bitmap.data[idx + 0] = average; // Red
        this.bitmap.data[idx + 1] = average; // Green
        this.bitmap.data[idx + 2] = average; // Blue
      });
  }

  /**
// Read the input image
Jimp.read('input.png')
  .then(image => {
    // Apply thermal iridescence effect
    applyThermalIridescence(image);
    
    // Save the modified image
    return image.writeAsync('output.png');
  })
  .then(() => {
    console.log('Image processing complete.');
  })
  .catch(err => {
    console.error('An error occurred:', err);
  });
*/
}

module.exports = WordTimeClusterReport;
