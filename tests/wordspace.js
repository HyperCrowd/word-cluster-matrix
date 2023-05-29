const WordTimeClusterReport = require('../wordTimeCluster');

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
