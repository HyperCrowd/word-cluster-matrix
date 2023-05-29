const WordTimeClusterReport = require('../wordTimeCluster');
const { sentence } = require('txtgen/dist/cjs/txtgen.js');

async function main() {
  const sentences = [];
  const times = [];

  for (let i = 0; i < 100; i++) {
    sentences.push(sentence());
    times.push(i);
  }
  const report = new WordTimeClusterReport(sentences, times);
  console.log(report);
  await report.toPng();
}

main();
