const math = require('mathjs'); // Import a math library for matrix operations
const natural = require('natural');
const { removeStopwords } = require('stopword');

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

    const minTime = math.min(times);
    const maxTime = math.max(times);

    let maxCluster = 0;

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

        if (this.uniqueWords[word].count > maxCluster) {
          maxCluster = this.uniqueWords[word].count;
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
    this.matrix = math.zeros(101, 101);
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
              maxCluster,
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
  print(matrix = this.matrix) {
    // Define the grayscale characters
    const grayscaleChars = [' ', '.', ':', '-', '=', '+', '*', '#', '%', '@'];

    // Iterate over the matrix and print grayscale map
    for (let i = 0; i < matrix.size()[0]; i++) {
      let row = '';
      for (let j = 0; j < matrix.size()[1]; j++) {
        const value = math.subset(matrix, math.index(i, j));
        const grayscaleIndex = Math.floor(value * grayscaleChars.length);
        row += value;
      }
      console.log(row);
    }
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
report.print();

module.exports = WordTimeClusterReport;
