const WordTimeClusterReport = require('../wordTimeCluster');
const { sentence } = require('txtgen/dist/cjs/txtgen.js');
const { readFile }  = require('fs/promises')
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

async function main() {
  const sentences = [];
  const times = [];

  for (let i = 0; i < 100; i++) {
    sentences.push(sentence());
    times.push(i);
  } 
  const report = new WordTimeClusterReport(sentences, times);

  await report.toPng('images/greyscale.png');
  loadElon()  // You need my local elonmusk.csv to run this :(
}

async function loadElon () {
  const lines = (await readFile('../../elonmusk.csv')).toString().split('\n')
  const years = {}
  const daysOfWeek = {}

  for (const line of lines) {
    const parts = line.split('\t')
    const date = new Date(parts[0])
    const year = date.getYear() + 1900
    const dayOfWeek = date.getDay()

    if (years[year] === undefined) {
      years[year] = {
        sentences: [],
        times: []
      }
    }

    if (daysOfWeek[dayOfWeek] === undefined) {
      daysOfWeek[dayOfWeek] = {
        sentences: [],
        times: []
      }
    }

    const time = date.getTime()

    years[year].times.push(time)
    years[year].sentences.push(parts[1])

    daysOfWeek[dayOfWeek].times.push(time)
    daysOfWeek[dayOfWeek].sentences.push(parts[1])
  }

  for (const year of Object.keys(years)) {
    const report = new WordTimeClusterReport(years[year].sentences, years[year].times)
    await report.toPng(`images/${year} - elonmusk.png`);
  }
/*
  for (const dayOfWeek of Object.keys(daysOfWeek)) {
    const report = new WordTimeClusterReport(daysOfWeek[dayOfWeek].sentences, daysOfWeek[dayOfWeek].times)
    await report.toPng(`images/${weekDays[dayOfWeek]} - elonmusk.png`);
  }
*/
}

main();
