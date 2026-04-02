
import { WaveformPoint, ConstellationPoint, TechniqueInfo } from './types';

export const FSK_INFO: TechniqueInfo = {
  name: "Frequency Shift Keying (FSK)",
  description: "FSK varies the frequency of the carrier. A logic '1' is transmitted as frequency f₁ (Mark) and logic '0' as frequency f₂ (Space). The amplitude remains constant.",
  pros: [
    "Better noise immunity than ASK (amplitude noise is ignored).",
    "Constant envelope allows efficient Class C amplifiers.",
    "Robust against signal fading."
  ],
  cons: [
    "Requires more bandwidth than ASK or PSK.",
    "Demodulation is more complex than ASK.",
    "Phase discontinuities can cause spectral spreading (unless CPFSK is used)."
  ],
  useCases: [
    "Caller ID systems.",
    "Legacy modems (e.g., V.21).",
    "Garage door openers and keyless entry.",
    "Bluetooth (uses Gaussian FSK)."
  ],
  equation: "v(t) = A_c \\cos(2\\pi f_i t), \\; f_i \\in \\{f_1, f_2\\}"
};

export const generateFskWaveform = (bitSequence: string): WaveformPoint[] => {
  const points: WaveformPoint[] = [];
  const carrierFreq = 2; // Hz (base for viz carrier ref)
  const samplingPoints = 50;
  
  // FSK freqs
  const fMark = 3; 
  const fSpace = 1;

  const bits = bitSequence.split('').map(b => parseInt(b));
  let t = 0;

  for (let i = 0; i < bits.length; i++) {
    const bit = bits[i];
    
    for (let j = 0; j < samplingPoints; j++) {
      const timeInBit = j / samplingPoints;
      const absoluteTime = t + timeInBit;
      
      // Reference carrier
      const carrier = Math.sin(2 * Math.PI * carrierFreq * absoluteTime);

      // FSK: Logic 1 = fMark, Logic 0 = fSpace
      const freq = bit === 1 ? fMark : fSpace;
      const modulated = Math.sin(2 * Math.PI * freq * absoluteTime);

      points.push({
        time: absoluteTime,
        bit: bit,
        carrier,
        modulated
      });
    }
    t += 1;
  }
  return points;
};

export const generateFskConstellation = (): ConstellationPoint[] => {
  // Orthogonal FSK representation in signal space
  return [
    { i: 0, q: 1, label: '1 (f1)' },
    { i: 1, q: 0, label: '0 (f2)' }
  ];
};
