const Kurtosis = require('./kurtosis')
const Mean = require('./mean')
const Median = require('./median')
const Minmax = require('./minmax')
const Sd = require('./sd')
const Skewness = require('./skewness')
const Quintiles = require('./quintiles')
const PeakLocals = require('./peakLocals')
const ZeroCrossings = require('./zeroCrossings')
const Trends = require('./trends')
const Autocorrelations = require('./autocorrelations')
const EnergyMeasures = require('./energyMeasures')
const SignalEnvelope = require('./signalEnvelope')
const WaveformShape = require('./waveformShape')
const TimeSeries = require('./timeSeries')
const CrossFeatures = require('./crossFeatures')

/**

*/

function getFeatures (numbers, ignoreArrays = false) {
  const mean = Mean(numbers)
  const median = Median(numbers)
  const minmax = Minmax(numbers)
  const sd = Sd(numbers, mean)
  const skewness = Skewness(numbers, sd, mean)
  const kurtosis = Kurtosis(numbers, sd, mean)
  const quintiles = Quintiles(numbers)
  const peakLocals = PeakLocals(numbers)
  const zeroCrossings = ZeroCrossings(numbers)
  const trends = Trends(numbers)
  const energyMeasures = EnergyMeasures(numbers)
  const signalEnvelope = SignalEnvelope(numbers)
  const waveformShape = WaveformShape(numbers)

  const result = {
    mean,
    median,
    ...minmax,
    standardDeviation: sd,
    skewness,
    kurtosis,
    interQuartile: quintiles[3] - quintiles[1],
    range: minmax.max - minmax.min,
    ...peakLocals,
    zeroCrossings,
    ...trends,
    ...energyMeasures,
    ...signalEnvelope,
    ...waveformShape
  }

  if (ignoreArrays) {
    return result
  } else {
    const timeSeriesByTen = TimeSeries(numbers)
    const crossFeatures = CrossFeatures(numbers)
    const autocorrelations = Autocorrelations(numbers)

    return {
      ...result,
      quintiles: getFeatures(quintiles, true),
      autocorrelations: getFeatures(autocorrelations, true),
      rollingByTen: {
        mean: getFeatures(timeSeriesByTen.rollingMean, true),
        standardDeviation:getFeatures(timeSeriesByTen.rollingStdDev, true),
        correlations: getFeatures(timeSeriesByTen.rollingCorrelations, true)
      },
      crossFeature: {
         pairwiseProducts: getFeatures(crossFeatures.pairwiseProducts, true),
         ratiosBetweenElements: getFeatures(crossFeatures.ratiosBetweenElements, true) 
      }
    }
  }
}

module.exports = getFeatures