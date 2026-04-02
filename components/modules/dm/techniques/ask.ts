
import { WaveformPoint, ConstellationPoint, TechniqueInfo } from './types';

export const ASK_INFO: TechniqueInfo = {
  name: "Amplitude Shift Keying (ASK)",
  description: "In ASK, the amplitude of the carrier wave is varied in accordance with the binary data. The simplest form is On-Off Keying (OOK), where the carrier is transmitted for '1' and suppressed for '0'.",
  pros: [
    "Simplest generation and detection (Envelope Detector).",
    "Low bandwidth requirement compared to FSK.",
    "Cost-effective for low-speed applications."
  ],
  cons: [
    "Highly susceptible to noise (atmospheric noise affects amplitude).",
    "Low power efficiency (energy wasted in carrier).",
    "Non-linear amplification causes distortion."
  ],
  useCases: [
    "Infrared remote controls (TV remotes).",
    "Optical fiber communications (Light intensity modulation).",
    "Low-frequency inductive systems (RFID)."
  ],
  equation: "v(t) = A_c \\cdot m(t) \\cdot \\cos(2\\pi f_c t)"
};

export const generateAskWaveform = (bitSequence: string): WaveformPoint[] => {
  const points: WaveformPoint[] = [];
  const carrierFreq = 2; // Hz
  const samplingPoints = 50; // Points per bit duration

  const bits = bitSequence.split('').map(b => parseInt(b));
  let t = 0;

  for (let i = 0; i < bits.length; i++) {
    const bit = bits[i];
    
    for (let j = 0; j < samplingPoints; j++) {
      const timeInBit = j / samplingPoints;
      const absoluteTime = t + timeInBit;
      
      const carrierSin = Math.sin(2 * Math.PI * carrierFreq * absoluteTime);
      
      // ASK: A * bit * sin(wt). 
      const carrier = carrierSin;
      const modulated = bit === 1 ? carrierSin : 0;

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

export const generateAskConstellation = (): ConstellationPoint[] => {
  // Binary ASK (On-Off Keying)
  return [
    { i: 0, q: 0, label: '0' },
    { i: 1, q: 0, label: '1' }
  ];
};
