
import { WaveformPoint, ConstellationPoint, TechniqueInfo } from './types';

export const BPSK_INFO: TechniqueInfo = {
  name: "Binary Phase Shift Keying (BPSK)",
  description: "BPSK is the simplest form of PSK where the phase of the carrier shifts by 180° (π radians) to represent binary data. '1' is typically 0° and '0' is 180°.",
  pros: [
    "Highly power efficient.",
    "Better noise immunity than ASK.",
    "Simple implementation compared to QAM."
  ],
  cons: [
    "Low Spectral Efficiency (1 bit/symbol).",
    "Requires coherent detection.",
    "Phase ambiguity issues."
  ],
  useCases: [
    "Deep space telemetry.",
    "RFID standards (Bi-Phase).",
    "ZigBee (IEEE 802.15.4)."
  ],
  equation: "v(t) = A_c \\cos(2\\pi f_c t + \\pi(1-d(t)))"
};

export const QPSK_INFO: TechniqueInfo = {
  name: "Quadrature Phase Shift Keying (QPSK)",
  description: "QPSK uses four distinct phase shifts (45°, 135°, 225°, 315°) to encode 2 bits per symbol. This doubles the bandwidth efficiency compared to BPSK without increasing bandwidth usage.",
  pros: [
    "Twice the spectral efficiency of BPSK (2 bits/symbol).",
    "Same Bit Error Rate (BER) performance as BPSK.",
    "Standard for modern satellite & cellular comms."
  ],
  cons: [
    "More complex receiver than BPSK.",
    "Susceptible to phase noise.",
    "Requires linear amplification."
  ],
  useCases: [
    "Satellite TV (DVB-S).",
    "Cable Modems.",
    "4G LTE / 5G Control channels.",
    "Video Conferencing."
  ],
  equation: "v(t) = A \\cos(2\\pi f_c t + (2i-1)\\frac{\pi}{4}), \\; i=1,2,3,4"
};

// Default export for backward compatibility if needed, though we will use specifics
export const PSK_INFO = BPSK_INFO;

export const generatePskWaveform = (bitSequence: string, variant: 'BPSK' | 'QPSK' = 'BPSK'): WaveformPoint[] => {
  const points: WaveformPoint[] = [];
  const carrierFreq = 2; // Hz
  const samplingPoints = 50; // Points per BIT duration

  const bits = bitSequence.split('').map(b => parseInt(b));
  
  if (variant === 'BPSK') {
    let t = 0;
    for (let i = 0; i < bits.length; i++) {
      const bit = bits[i];
      for (let j = 0; j < samplingPoints; j++) {
        const timeInBit = j / samplingPoints;
        const absoluteTime = t + timeInBit;
        const carrierSin = Math.sin(2 * Math.PI * carrierFreq * absoluteTime);
        
        // BPSK: Logic 1 = 0 deg (+sin), Logic 0 = 180 deg (-sin)
        const modulated = bit === 1 ? carrierSin : -1 * carrierSin;

        points.push({
          time: absoluteTime,
          bit: bit,
          carrier: carrierSin,
          modulated
        });
      }
      t += 1;
    }
  } else {
    // QPSK Logic
    // We process 2 bits at a time (Dibits)
    // 1 Symbol = 2 bits. 
    // To visualize this on the same time scale as others, we extend the symbol duration to 2 time units?
    // Or we keep symbol duration = 1 time unit (meaning twice the data rate).
    // For visualization clarity: Let's assume Symbol Duration = 2 * Bit Duration of BPSK to match the x-axis "Time" feel,
    // OR simply process pairs.
    
    // Let's pair them up.
    let t = 0;
    for (let i = 0; i < bits.length; i += 2) {
      // If we have an odd number at the end, treat last bit as 0 padding
      const b1 = bits[i];
      const b2 = (i + 1 < bits.length) ? bits[i+1] : 0;
      
      // Gray Coding Mapping often used:
      // 11 -> 45  (pi/4)
      // 01 -> 135 (3pi/4)
      // 00 -> 225 (5pi/4)
      // 10 -> 315 (7pi/4)
      
      let phaseShift = 0;
      if (b1 === 1 && b2 === 1) phaseShift = 0.25 * Math.PI;       // 45
      else if (b1 === 0 && b2 === 1) phaseShift = 0.75 * Math.PI;  // 135
      else if (b1 === 0 && b2 === 0) phaseShift = 1.25 * Math.PI;  // 225
      else if (b1 === 1 && b2 === 0) phaseShift = 1.75 * Math.PI;  // 315

      // Visualize 1 symbol duration (make it longer so we see the phase clearly?)
      // Let's make 1 QPSK symbol = 2 arbitrary time units to match the bit-stream length visually
      const symbolDuration = 2; 
      const samplesPerSymbol = samplingPoints * 2;

      for (let j = 0; j < samplesPerSymbol; j++) {
        const timeInSymbol = (j / samplesPerSymbol) * symbolDuration;
        const absoluteTime = t + timeInSymbol;
        
        // Ref carrier
        const carrier = Math.sin(2 * Math.PI * carrierFreq * absoluteTime);
        
        // Modulated: sin(wt + phase)
        const modulated = Math.sin(2 * Math.PI * carrierFreq * absoluteTime + phaseShift);

        points.push({
          time: absoluteTime,
          bit: b1, // Roughly showing first bit for tracking
          carrier,
          modulated
        });
      }
      t += symbolDuration;
    }
  }
  
  return points;
};

export const generatePskConstellation = (variant: 'BPSK' | 'QPSK' = 'BPSK'): ConstellationPoint[] => {
  if (variant === 'BPSK') {
    return [
      { i: -1, q: 0, label: '0 (180°)' },
      { i: 1, q: 0, label: '1 (0°)' }
    ];
  } else {
    // QPSK (Unit circle radius 1)
    // 45 deg:  0.707, 0.707
    // 135 deg: -0.707, 0.707
    // 225 deg: -0.707, -0.707
    // 315 deg: 0.707, -0.707
    const val = 0.707;
    return [
      { i: val, q: val, label: '11' },
      { i: -val, q: val, label: '01' },
      { i: -val, q: -val, label: '00' },
      { i: val, q: -val, label: '10' }
    ];
  }
};
