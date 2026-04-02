
import { WaveformPoint, ConstellationPoint, TechniqueInfo } from './types';

export const QAM_INFO: TechniqueInfo = {
  name: "Quadrature Amplitude Modulation (QAM)",
  description: "QAM varies both the amplitude and phase of the carrier. It combines ASK and PSK to transmit multiple bits per symbol, maximizing spectral efficiency.",
  pros: [
    "Highest spectral efficiency (bits per Hz).",
    "High data rates suitable for modern internet demands.",
    "Scalable (16-QAM, 64-QAM, 256-QAM)."
  ],
  cons: [
    "Very susceptible to noise (both amplitude and phase errors).",
    "Requires linear amplifiers (less efficient).",
    "Complex hardware for synchronization and equalization."
  ],
  useCases: [
    "Digital Cable TV (DVB-C).",
    "Modern Wi-Fi standards (802.11ac/ax).",
    "LTE and 5G Cellular networks.",
    "Microwave links."
  ],
  equation: "v(t) = I(t)\\cos(2\\pi f_c t) - Q(t)\\sin(2\\pi f_c t)"
};

export const generateQamWaveform = (bitSequence: string): WaveformPoint[] => {
  const points: WaveformPoint[] = [];
  const carrierFreq = 2; 
  const samplingPoints = 50;

  const bits = bitSequence.split('').map(b => parseInt(b));
  let t = 0;

  for (let i = 0; i < bits.length; i++) {
    const bit = bits[i];
    for (let j = 0; j < samplingPoints; j++) {
      const timeInBit = j / samplingPoints;
      const absoluteTime = t + timeInBit;
      const carrierSin = Math.sin(2 * Math.PI * carrierFreq * absoluteTime);
      
      // QAM - Not visualizing waveform time-domain as primary, keeping generic carrier for consistency
      points.push({
        time: absoluteTime,
        bit: bit,
        carrier: carrierSin,
        modulated: carrierSin 
      });
    }
    t += 1;
  }
  return points;
};

export const generateQamConstellation = (): ConstellationPoint[] => {
  // 4-QAM / QPSK
  return [
    { i: 1, q: 1, label: '11' },
    { i: -1, q: 1, label: '01' },
    { i: -1, q: -1, label: '00' },
    { i: 1, q: -1, label: '10' }
  ];
};
