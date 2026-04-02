import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Info, Zap } from 'lucide-react';

const SamplingQuantization: React.FC = () => {
  // State for interactive controls
  const [bitDepth, setBitDepth] = useState<number>(3); // n bits (2 to 5)
  const [samplingRate, setSamplingRate] = useState<number>(20); // Samples per cycle
  const [amplitude, setAmplitude] = useState<number>(20); // Vmax
  const [noiseLevel, setNoiseLevel] = useState<number>(0); // Noise amplitude

  // Calculations based on state
  const levels = Math.pow(2, bitDepth); // L = 2^n
  const vMax = amplitude;
  const vMin = -amplitude;
  const range = vMax - vMin;
  const stepSize = range / levels; // Delta = (Vmax - Vmin) / L
  
  // Generate Data
  const data = useMemo(() => {
    const points = [];
    const totalPoints = 100; // Resolution of the analog wave
    
    for (let i = 0; i <= totalPoints; i++) {
      const t = (i / totalPoints) * 2 * Math.PI; // One full cycle (0 to 2pi)
      const cleanAnalog = amplitude * Math.sin(t);
      
      // Add deterministic noise (Jitter)
      // We use sin/cos with high frequency to simulate random noise deterministically based on 'i'
      // This prevents the chart from flickering randomly when other sliders move
      const randomJitter = Math.sin(i * 132.5) * Math.cos(i * 45.2); 
      const noise = randomJitter * noiseLevel;
      const effectiveInput = cleanAnalog + noise;

      // Quantization Logic
      // 1. Normalize to 0..L
      const normalized = (effectiveInput - vMin) / stepSize;
      // 2. Round to nearest level index (0 to L-1)
      let levelIndex = Math.floor(normalized);
      if (levelIndex < 0) levelIndex = 0;
      if (levelIndex >= levels) levelIndex = levels - 1;
      
      // Calculate Midpoint Value
      const quantizedVal = vMin + (levelIndex * stepSize) + (stepSize / 2);
      
      // Sample Logic: Only show quantized value at sampling intervals
      const sampleInterval = totalPoints / samplingRate;
      const isSamplePoint = i % Math.round(sampleInterval) === 0;

      points.push({
        time: i,
        analog: effectiveInput, // Visualize the noisy input
        cleanAnalog: cleanAnalog, // Keep reference
        quantized: quantizedVal,
        sample: isSamplePoint ? quantizedVal : null,
        error: effectiveInput - quantizedVal
      });
    }
    return points;
  }, [bitDepth, samplingRate, amplitude, noiseLevel, levels, vMin, stepSize]);

  const snr = (1.76 + 6.02 * bitDepth).toFixed(2); // Theoretical SNR dB formula

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Sampling & Quantization</h2>
        <p className="text-slate-600 mt-2">
          Explore how converting an analog signal to digital depends on the number of bits (Quantization) and frequency (Sampling).
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-semibold text-indigo-900 border-b pb-2">Configuration</h3>
          
          {/* Bit Depth Control */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-slate-700">
                Bit Depth (n): <span className="text-indigo-600 font-bold">{bitDepth} bits</span>
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 hover:text-indigo-600 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none font-normal">
                  Determines the number of quantization levels (L = 2ⁿ). Increasing this adds more levels, which reduces the quantization error (noise) and makes the signal smoother, but increases the data size.
                  <div className="absolute top-full right-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </div>
            <input 
              type="range" min="2" max="6" step="1"
              value={bitDepth}
              onChange={(e) => setBitDepth(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="text-xs text-slate-500 mt-1 flex justify-between">
              <span>Levels (L): {levels}</span>
              <span>Step Size: {stepSize.toFixed(2)}V</span>
            </div>
          </div>

          {/* Sampling Rate Control */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-slate-700">
                Sampling Rate: <span className="text-indigo-600 font-bold">{samplingRate} Hz</span>
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 hover:text-indigo-600 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none font-normal">
                  Controls how frequently the analog signal is measured. According to the Nyquist theorem, this must be at least twice the maximum frequency of the signal to reconstruct it accurately without aliasing.
                  <div className="absolute top-full right-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </div>
            <input 
              type="range" min="5" max="50" step="5"
              value={samplingRate}
              onChange={(e) => setSamplingRate(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <p className="text-xs text-slate-500 mt-1">
              Nyquist Rate requires Fs &ge; 2 * Fm
            </p>
          </div>

          {/* Noise Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <Zap className="w-3 h-3 mr-1 text-amber-500" />
                Input Noise (Jitter)
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-slate-400 hover:text-indigo-600 cursor-help" />
                <div className="absolute bottom-full right-0 mb-2 w-56 p-2 bg-slate-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none font-normal">
                  Simulates random noise added to the analog signal BEFORE quantization. Observe how the quantized output jumps erratically when the noise amplitude exceeds the step size.
                  <div className="absolute top-full right-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </div>
            <input 
              type="range" min="0" max="5" step="0.5"
              value={noiseLevel}
              onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="text-xs text-slate-500 mt-1 flex justify-between">
              <span>Clean</span>
              <span>Noisy ({noiseLevel.toFixed(1)}V)</span>
            </div>
          </div>

          {/* Stats Box */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Theoretical Metrics</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-slate-500">Bit Rate</div>
                <div className="font-mono font-semibold text-slate-800">{bitDepth * samplingRate} bps</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">SNR (Quant)</div>
                <div className="font-mono font-semibold text-slate-800">{snr} dB</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 italic border-t pt-4">
            "The smaller the magnitude of a quantum (step size), the better the resolution."
          </div>
        </div>

        {/* Visualization Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Waveform */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span> Analog Input
              <span className="w-3 h-3 rounded-full bg-emerald-500 mx-2 ml-4"></span> Quantized Output
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[-25, 25]} tickCount={7} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(val: number) => val.toFixed(2)}
                  />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  
                  {/* Clean Signal Reference (Faint) */}
                  <Line 
                    type="monotone" 
                    dataKey="cleanAnalog" 
                    stroke="#cbd5e1" 
                    strokeWidth={1} 
                    dot={false} 
                    strokeDasharray="4 4"
                    name="Clean Reference"
                  />

                  {/* Noisy Analog Input */}
                  <Line 
                    type="monotone" 
                    dataKey="analog" 
                    stroke="#6366f1" 
                    strokeWidth={2} 
                    dot={false} 
                    name="Analog Input (Noisy)"
                    animationDuration={0} // Disable animation for instant noise feedback
                  />

                  {/* Quantized Steps */}
                  <Line 
                    type="stepAfter" 
                    dataKey="quantized" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    dot={false}
                    name="Quantized"
                    strokeDasharray="5 5"
                    opacity={0.8}
                    animationDuration={300}
                  />
                  {/* Sample Points */}
                  <Line
                    type="monotone"
                    dataKey="sample"
                    stroke="none"
                    fill="#10b981"
                    dot={{ r: 4, fill: '#10b981' }}
                    name="Sample Points"
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quantization Error */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center">
              <span className="w-3 h-3 rounded-full bg-rose-500 mr-2"></span> Quantization Error (Noise)
            </h3>
            <div className="h-32 w-full">
              <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="time" hide />
                  {/* Expand domain to handle large noise inputs */}
                  <YAxis domain={['auto', 'auto']} /> 
                  <RechartsTooltip formatter={(val: number) => val.toFixed(3)} />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Line 
                    type="monotone" 
                    dataKey="error" 
                    stroke="#f43f5e" 
                    strokeWidth={1} 
                    dot={false}
                    fill="#f43f5e"
                    animationDuration={0}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              The error signal is the difference between the noisy input and the quantized levels. High input jitter causes the error to fluctuate more rapidly.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SamplingQuantization;