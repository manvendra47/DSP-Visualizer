import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdaptiveDeltaModulation: React.FC = () => {
  const [baseStep, setBaseStep] = useState(1.0);
  const [frequency, setFrequency] = useState(1);
  
  // Constants
  const amplitude = 10;
  const samplingRate = 50; // fixed high sampling rate for DM
  const totalSamples = 100;

  const data = useMemo(() => {
    const points = [];
    
    // State for Standard DM
    let dmValue = 0;
    
    // State for Adaptive DM
    let admValue = 0;
    let admStep = baseStep;
    let prevBit = 0; // 1 for up, -1 for down
    let consecutiveCount = 0;

    for (let i = 0; i < totalSamples; i++) {
      const t = i / samplingRate;
      // Create a signal with varying slope to demonstrate ADM benefits
      // A mix of sine waves
      const analog = amplitude * Math.sin(2 * Math.PI * frequency * t);

      // --- Standard DM ---
      const dmError = analog - dmValue;
      // If error is positive, step up. Else step down.
      const dmBit = dmError >= 0 ? 1 : -1;
      dmValue += dmBit * baseStep;

      // --- Adaptive DM (ADM) ---
      // Algorithm: If bit is same as previous, increase step. Else decrease.
      // Simple logic: Song's algorithm or similar multiplicative increase
      const admError = analog - admValue;
      const admBit = admError >= 0 ? 1 : -1;
      
      if (admBit === prevBit) {
        consecutiveCount++;
        // Increase step size if we are consistently moving in same direction (Slope Overload detection)
        if (consecutiveCount >= 2) {
            admStep = Math.min(admStep * 1.5, baseStep * 4); 
        }
      } else {
        consecutiveCount = 0;
        // Decrease step size if direction changes (Granular Noise reduction)
        admStep = Math.max(admStep / 1.5, baseStep / 2);
      }
      
      admValue += admBit * admStep;
      prevBit = admBit;

      points.push({
        time: i,
        analog,
        dmValue,
        admValue,
        currentAdmStep: admStep // Visualizing the dynamic step size
      });
    }
    return points;
  }, [baseStep, frequency]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Adaptive Delta Modulation (ADM)</h2>
        <p className="text-slate-600 mt-2">
          ADM solves the trade-off between Slope Overload and Granular Noise by dynamically adjusting the step size based on the signal's slope.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-6">
          <h3 className="font-semibold text-indigo-900 border-b pb-2">Parameters</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Base Step Size (&Delta;): {baseStep}
            </label>
            <input 
              type="range" min="0.5" max="3" step="0.1"
              value={baseStep}
              onChange={(e) => setBaseStep(parseFloat(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Signal Frequency
            </label>
            <input 
              type="range" min="0.5" max="3" step="0.1"
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              className="w-full accent-purple-600"
            />
            <p className="text-xs text-slate-500 mt-2">
              Increase frequency to induce slope overload in the Standard DM (Green).
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200 text-sm space-y-2">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></span>
              <span className="font-semibold text-slate-700">Standard DM</span>
            </div>
            <p className="text-xs text-slate-500 pl-5">Fixed step size. Struggles with steep slopes (overload) or flat areas (noise).</p>
            
            <div className="flex items-center mt-3">
              <span className="w-3 h-3 bg-purple-600 rounded-full mr-2"></span>
              <span className="font-semibold text-slate-700">Adaptive DM</span>
            </div>
            <p className="text-xs text-slate-500 pl-5">Variable step size. Grows when slope is steep, shrinks when flat.</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-4 text-sm">Waveform Comparison</h4>
            <div className="h-80 w-full">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[-15, 15]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="analog" stroke="#94a3b8" strokeWidth={2} dot={false} name="Analog Input" />
                  <Line type="stepAfter" dataKey="dmValue" stroke="#10b981" strokeWidth={2} dot={false} name="Standard DM" />
                  <Line type="stepAfter" dataKey="admValue" stroke="#7c3aed" strokeWidth={2} dot={false} name="Adaptive DM" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-4 text-sm">ADM Step Size Adaptation</h4>
            <div className="h-32 w-full">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" hide />
                  <YAxis />
                  <Tooltip />
                  <Line type="stepAfter" dataKey="currentAdmStep" stroke="#f59e0b" strokeWidth={2} dot={false} fill="#f59e0b" name="Step Size" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Observe how the step size (Orange) increases during the steep parts of the sine wave and decreases at the peaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdaptiveDeltaModulation;