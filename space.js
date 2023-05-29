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

    this.timeSentenceMap = new Array(100);
    this.uniqueWords = {};
    this.uniqueWordSentencePosition = {};

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

    this.matrixSnapshots = [];
    let sliceIndex = 0;
    for (const timeSentence of this.timeSentenceMap) {
      for (const slice of this.timeSentenceMap.slice(0, sliceIndex)) {
      }
      sliceIndex += 1;
    }
  }

  /**
   *
   */
  calculatePercentage(start, end, position) {
    const percentage = ((position - start) / (end - start)) * 100;
    return Math.floor(percentage);
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
console.log(report);

module.exports = WordTimeClusterReport;
