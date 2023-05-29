const Kurtosis = require('./kurtosis')
const Mean = require('./mean')
const Median = require('./median')
const Minmax = require('./minmax')
const Sd = require('./sd')
const Skewness = require('./skewness')
const Quintiles = require('./quintiles')
const PeakLocals = require('./peakLocals')
const ZeroCrossings = require('./zeroCrossings')
// const Trends = require('./trends')
// const Autocorrelations = require('./trends')
// const FrequencyDomain = require('./trends')
// const EnergyMeasures = require('./trends')
// const SignalEnvelope = require('./trends')
// const WaveformShape = require('./trends')
// const TimeSeries = require('./trends')
// const CrossFeatures = require('./trends')

/**
give me javascript that takes an array of numbers and calculates trend in the vector by fitting a linear or polynomial regression line and extracting features such as slope and intercept.

give me javascript that takes an array of numbers and calculates autocorrelation coefficients at different lags to capture the relationship between values at different time points

give me javascript that takes an array of numbers and calculates Fourier Transform to extract features such as dominant frequencies, power spectrum density, or spectral entropy.

give me javascript that takes an array of numbers and calculates energy-related features, such as the total energy or the sum of squared values in the vector.

give me javascript that takes an array of numbers and calculates features related to the amplitude envelope of the signal, such as peak-to-peak amplitude or the mean envelope amplitude.

give me javascript that takes an array of numbers and calculates shape descriptors like the rate of rise, decay, or other waveform characteristics to capture the shape of the vector.

give me javascript that takes an array of numbers and calculates rolling statistics such as rolling mean, rolling standard deviation, or rolling correlations with neighboring values.

give me javascript that takes an array of numbers and calculates interactions between different components of the vector, such as computing pairwise products or ratios between elements.
*/

function getFeatures (numbers) {
  const mean = Mean(numbers)
  const median = Median(numbers)
  const minmax = Minmax(numbers)
  const sd = Sd(numbers, mean)
  const skewness = Skewness(numbers, sd, mean)
  const kurtosis = Kurtosis(numbers, sd, mean)
  const quintiles = Quintiles(numbers)
  const peakLocals = PeakLocals(numbers)
  const zeroCrossings = ZeroCrossings(numbers)
  // const trends = Trends(numbers)
  // const autocorrelations = Autocorrelations(numbers)
  // const frequencyDomain = FrequencyDomain(numbers)
  // const energyMeasures = EnergyMeasures(numbers)
  // const signalEnvelope = SignalEnvelope(numbers)
  // const waveformShape = WaveformShape(numbers)
  // const timeSeries = TimeSeries(numbers)
  // const crossFeatures = CrossFeatures(numbers)

  return {
    mean,
    median,
    minmax,
    sd,
    skewness,
    kurtosis,
    quintiles,
    interQuartile: quintiles[3] - quintiles[1],
    range: minmax.max - minmax.min,
    peakLocals,
    zeroCrossings,
    // trends,
    // autocorrelations,
    // frequencyDomain,
    // energyMeasures,
    // signalEnvelope,
    // waveformShape,
    // timeSeries,
    // crossFeatures
  }
}

console.log(getFeatures([1,2,3,4,5]))

module.exports = getFeatures