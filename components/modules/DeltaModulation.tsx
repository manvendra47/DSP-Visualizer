import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DeltaModulation: React.FC = () => {
  const [stepSize, setStepSize] = useState(0.8); // Delta
  const [samplingFactor, setSamplingFactor] = useState(15); // How fast we sample

  const data = useMemo(() => {
    const points = [];
    const totalPoints = 100;
    let currentDMValue = 0; // The accumulator output
    const amplitude = 10;
    
    // We simulate a sine wave
    // For DM, we compare current Analog value vs Previous DM value
    
    for (let i = 0; i <= totalPoints; i++) {
      const t = (i / totalPoints) * 2 * Math.PI;
      const analog = amplitude * Math.sin(t);
      
      // DM Logic happens at discrete intervals
      const isSamplingInstant = i % (Math.max(1, Math.floor(50 / samplingFactor))) === 0;
      
      if (isSamplingInstant) {
        // Predictor/Comparator logic
        // If Analog > Current Staircase, increase by Delta. Else decrease.
        if (analog > currentDMValue) {
          currentDMValue += stepSize;
        } else {
          currentDMValue -= stepSize;
        }
      }

      points.push({
        time: i,
        analog: analog,
        dmOutput: currentDMValue
      });
    }
    return points;
  }, [stepSize, samplingFactor]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Delta Modulation (DM)</h2>
        <p className="text-slate-600 mt-2">
          DM is a simplified DPCM where only 1 bit is transmitted per sample, indicating if the signal rose or fell by a fixed step size (&Delta;).
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit space-y-6">
          <h3 className="font-semibold text-indigo-900 border-b pb-2">DM Controls</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Step Size (&Delta;): {stepSize.toFixed(1)}
            </label>
            <input 
              type="range" min="0.5" max="5" step="0.1"
              value={stepSize}
              onChange={(e) => setStepSize(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Large &Delta; reduces slope overload but increases granular noise.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Sampling Rate: {samplingFactor}x
            </label>
            <input 
              type="range" min="5" max="40" step="1"
              value={samplingFactor}
              onChange={(e) => setSamplingFactor(parseInt(e.target.value))}
              className="w-full accent-emerald-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Higher rate tracks signal better but requires more bandwidth.
            </p>
          </div>

          <div className="bg-rose-50 p-3 rounded border border-rose-100 text-xs text-rose-800">
            <strong>Try this:</strong> Set Step Size very low (0.5) to see <em>Slope Overload</em> on the steep parts of the sine wave. Set Step Size high (4.0) to see <em>Granular Noise</em> on the peaks.
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" hide />
                <YAxis domain={[-15, 15]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="analog" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  name="Analog Input"
                  dot={false}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="dmOutput" 
                  stroke="#059669" 
                  strokeWidth={2} 
                  name="DM Output (Accumulator)"
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 p-6 rounded-xl">
        <h3 className="font-bold text-slate-800 mb-3">Key Concepts</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
          <div className="bg-white p-4 rounded shadow-sm">
            <strong className="text-rose-600">Slope Overload</strong>
            <p>Occurs when the analog signal changes faster than the step size can accommodate. The staircase falls behind.</p>
            <code className="block mt-1 bg-slate-100 p-1 rounded text-xs">Fix: Increase Step Size or Clock Freq</code>
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <strong className="text-rose-600">Granular Noise</strong>
            <p>Occurs when the analog signal is relatively constant. The step size is too large, causing the output to oscillate around the value.</p>
            <code className="block mt-1 bg-slate-100 p-1 rounded text-xs">Fix: Decrease Step Size (or use ADM)</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeltaModulation;