const GrammarFieldManager = require('../grammarFieldManager');
const TwintSqlite  = require('../loaders/twint-sqlite')

function assert (a, b) {
  if (a !== b) {
    throw new RangeError(`${a} does not equal ${b}`)
  }
}

async function main() {
  const tweets = new TwintSqlite('../../tweets.db')
  const manager = new GrammarFieldManager('test', tweets.text, tweets.times)
  const summary = manager.summary()

  assert(summary.hourly['0'], 278)
  assert(summary.hourly['1'], 322)
  assert(summary.hourly['2'], 328)
  assert(summary.hourly['3'], 305)
  assert(summary.hourly['4'], 285)
  assert(summary.hourly['5'], 319)
  assert(summary.hourly['6'], 342)
  assert(summary.hourly['7'], 321)
  assert(summary.hourly['8'], 293)
  assert(summary.hourly['9'], 283)
  assert(summary.hourly['10'], 340)
  assert(summary.hourly['11'], 330)
  assert(summary.hourly['12'], 297)
  assert(summary.hourly['13'], 312)
  assert(summary.hourly['14'], 327)
  assert(summary.hourly['15'], 271)
  assert(summary.hourly['16'], 293)
  assert(summary.hourly['17'], 313)
  assert(summary.hourly['18'], 303)
  assert(summary.hourly['19'], 305)
  assert(summary.hourly['20'], 317)
  assert(summary.hourly['21'], 310)
  assert(summary.hourly['22'], 292)
  assert(summary.hourly['23'], 314)
}

main();
