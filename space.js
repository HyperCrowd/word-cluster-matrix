const math = require('mathjs'); // Import a math library for matrix operations
const natural = require('natural');
const { removeStopwords } = require('stopword');
const { PNG } = require('pngjs');
const fs = require('fs');

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

    const minTime = math.min(times);
    const maxTime = math.max(times);

    // Prepare word-sentence indexes
    let sentenceIndex = 0;

    for (const sentence of sentences) {
      const words = removeStopwords(tokenizer.tokenize(sentence));

      for (const word of words) {
        if (this.uniqueWords[word] === undefined) {
          this.uniqueWords[word] = {
            count: 0,
            sentences: [],
          };
        }

        this.uniqueWords[word].count += 1;
        this.uniqueWords[word].sentences.push(sentenceIndex);

        if (this.uniqueWords[word].count > this.maxCluster) {
          this.maxCluster = this.uniqueWords[word].count;
        }
      }

      sentenceIndex += 1;
    }

    // Prepare time-sentence indexes
    sentenceIndex = 0;
    for (const time of times) {
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
    // Iterate through all time-sentence maps
    for (const timeSentence of this.timeSentenceMap) {
      if (timeSentence === undefined) {
        timeIndex += 1;
        continue;
      }

      // Iterate through each sentence in the time map
      for (const sentenceIndex of timeSentence) {
        // Iterate through every unique word
        for (const uniqueWord of uniqueWords) {
          // Select words that appear in this sentence
          if (uniqueWord.sentences.indexOf(sentenceIndex) > -1) {
            // Get the time/cluster position
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

            this.matrix = math.subset(
              this.matrix,
              math.index(timeIndex, clusterPosition),
              value + 1
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
  toPng(matrix = this.matrix, outputPath = 'tmp/greyscale.png') {
    // Define image dimensions based on matrix size
    const width = matrix.size()[1];
    const height = matrix.size()[0];

    // Create a new PNG instance
    const png = new PNG({ width, height });

    // Iterate over the matrix and set grayscale pixel values in the PNG image
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = math.subset(matrix, math.index(y, x)) / this.maxCluster;
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
}

// Example usage:
const report = new WordTimeClusterReport(
  [
    'is this real',
    'it is indeed real',
    'what about now? what is real',
    'this is not',
    'my bad homie',
    'no sweat, stay real',
  ],
  [0, 1, 2, 3, 4, 5]
);

async function main() {
  await report.toPng();
}

main();

module.exports = WordTimeClusterReport;
