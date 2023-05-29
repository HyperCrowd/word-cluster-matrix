module.exports = function (numbers) {
  // Calculate peak-to-peak amplitude
  const peakToPeakAmplitude = Math.max(...numbers) - Math.min(...numbers);

  // Calculate mean envelope amplitude
  const envelopeAmplitude = numbers.map(Math.abs);
  const meanEnvelopeAmplitude = envelopeAmplitude.reduce((sum, value) => sum + value, 0) / envelopeAmplitude.length;

  return { peakToPeakAmplitude, meanEnvelopeAmplitude };
}