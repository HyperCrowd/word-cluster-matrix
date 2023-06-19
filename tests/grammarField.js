const GrammarField = require('../grammarField');
const { readFile }  = require('fs/promises')

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

async function main() {
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
    const field = new GrammarField(years[year].sentences, years[year].times)
    await field.toPng(`images/${year}.elonmusk.png`);
    await field.generateFeatures(`images/${year}.features.elonmusk.png`)
  }

/*
  for (const dayOfWeek of Object.keys(daysOfWeek)) {
    const field = new GrammarField(daysOfWeek[dayOfWeek].sentences, daysOfWeek[dayOfWeek].times)
    await field.toPng(`images/${weekDays[dayOfWeek]} - elonmusk.png`);
  }
*/
}

main();
