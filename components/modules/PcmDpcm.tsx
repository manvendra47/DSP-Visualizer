import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

const PcmDpcm: React.FC = () => {
  const [freq, setFreq] = useState(2);
  const [pcmBits, setPcmBits] = useState(4);
  const [dpcmBits, setDpcmBits] = useState(3); // DPCM typically uses fewer bits
  
  const amplitude = 10;
  const samplesPerCycle = 20;
  const samplingRate = freq * samplesPerCycle;

  const data = useMemo(() => {
    const points = [];
    const totalSamples = 60;
    
    // DPCM State
    let dpcmPrediction = 0;
    let dpcmReconstructed = 0;

    // Calculate Step Sizes
    // PCM Range: [-10, 10] -> 20. Levels = 2^n.
    const pcmLevels = Math.pow(2, pcmBits);
    const pcmStep = (2 * amplitude) / pcmLevels;

    // DPCM Error Range: DPCM assumes differences are smaller. 
    // Let's assume we optimize the quantizer for a range of [-amplitude, amplitude] for simplicity,
    // or slightly less if we assume high correlation. To be fair in this demo, we'll use the same full range 
    // to show how DPCM can look worse if bits are low, or we can restrict range to show "slope overload" equivalent 
    // if difference is too big. Let's use a range of [-1.5*A, 1.5*A] typically for error? 
    // Actually, standard DPCM quantizer range is usually determined by signal statistics.
    // For this educational tool, we'll set the error quantization range to [-amplitude, amplitude].
    const dpcmErrorRange = amplitude * 1.5; 
    const dpcmLevels = Math.pow(2, dpcmBits);
    const dpcmStep = (2 * dpcmErrorRange) / dpcmLevels;

    for (let i = 0; i < totalSamples; i++) {
      const t = i / samplingRate;
      const analog = amplitude * Math.sin(2 * Math.PI * freq * t);

      // --- PCM ---
      // Quantize absolute value
      const pcmLevelIndex = Math.min(pcmLevels - 1, Math.max(0, Math.floor((analog + amplitude) / pcmStep)));
      const pcmValue = (pcmLevelIndex * pcmStep) + (pcmStep / 2) - amplitude;

      // --- DPCM ---
      // Prediction: x_hat[n] = x_rec[n-1]
      // Prediction Error: e[n] = x[n] - x_hat[n]
      const error = analog - dpcmPrediction;
      
      // Quantize Error
      const errorLevelIndex = Math.min(dpcmLevels - 1, Math.max(0, Math.floor((error + dpcmErrorRange) / dpcmStep)));
      const quantizedError = (errorLevelIndex * dpcmStep) + (dpcmStep / 2) - dpcmErrorRange;
      
      // Reconstruction: x_rec[n] = x_hat[n] + e_q[n]
      dpcmReconstructed = dpcmPrediction + quantizedError;
      
      // Update next prediction
      const currentPrediction = dpcmPrediction; // Store for plotting
      dpcmPrediction = dpcmReconstructed;

      points.push({
        time: i,
        analog,
        pcmValue,
        dpcmValue: dpcmReconstructed,
        prediction: currentPrediction,
        error: error,
        quantizedError: quantizedError
      });
    }
    return points;
  }, [freq, pcmBits, dpcmBits, amplitude, samplingRate]);

  const pcmBandwidth = samplingRate * pcmBits;
  const dpcmBandwidth = samplingRate * dpcmBits;
  const saving = Math.round(((pcmBandwidth - dpcmBandwidth) / pcmBandwidth) * 100);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">PCM vs DPCM Comparison</h2>
        <p className="text-slate-600 mt-2">
          Differential PCM (DPCM) transmits the <em>difference</em> between samples rather than the absolute value, often allowing for lower bit rates.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
          <h3 className="font-semibold text-indigo-900 border-b pb-2">Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Signal Frequency
            </label>
            <input 
              type="range" min="1" max="5" step="0.5"
              value={freq}
              onChange={(e) => setFreq(parseFloat(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Low (Correlated)</span>
              <span>High (Less Correlated)</span>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <label className="block text-sm font-bold text-indigo-800 mb-1">
              PCM Bits (n): {pcmBits}
            </label>
            <input 
              type="range" min="2" max="8"
              value={pcmBits}
              onChange={(e) => setPcmBits(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="mt-2 text-xs text-indigo-700">
              <strong>Bandwidth:</strong> {pcmBandwidth} bps
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <label className="block text-sm font-bold text-emerald-800 mb-1">
              DPCM Bits (k): {dpcmBits}
            </label>
            <input 
              type="range" min="2" max="8"
              value={dpcmBits}
              onChange={(e) => setDpcmBits(parseInt(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="mt-2 text-xs text-emerald-700">
              <strong>Bandwidth:</strong> {dpcmBandwidth} bps
            </div>
          </div>

          <div className="text-center p-4 bg-slate-800 text-white rounded-lg shadow">
            <div className="text-sm opacity-80">Bandwidth Saving</div>
            <div className="text-2xl font-bold text-emerald-400">{saving > 0 ? `${saving}%` : '0%'}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Signal Comparison */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-4 text-sm">Reconstructed Signals</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[-15, 15]} />
                  <Tooltip contentStyle={{ fontSize: '12px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="analog" stroke="#cbd5e1" strokeWidth={4} dot={false} name="Original Analog" />
                  <Line type="stepAfter" dataKey="pcmValue" stroke="#6366f1" strokeWidth={2} dot={false} name="PCM Output" />
                  <Line type="stepAfter" dataKey="dpcmValue" stroke="#10b981" strokeWidth={2} dot={false} name="DPCM Output" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* DPCM Internals */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-semibold text-slate-700 mb-4 text-sm flex justify-between items-center">
              <span>DPCM Internals: Prediction & Error</span>
              <span className="text-xs font-normal bg-slate-100 px-2 py-1 rounded text-slate-500">
                Notice the Error is smaller than the Signal
              </span>
            </h4>
            <div className="h-48 w-full">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" hide />
                  <YAxis />
                  <Tooltip contentStyle={{ fontSize: '12px' }} />
                  <Legend />
                  <ReferenceLine y={0} stroke="#e2e8f0" />
                  {/* Prediction (Delayed version) */}
                  <Line type="monotone" dataKey="prediction" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2} dot={false} name="Predicted Value" />
                  {/* The Error Signal being Quantized */}
                  <Line type="monotone" dataKey="error" stroke="#ef4444" strokeWidth={1} dot={false} fill="#ef4444" name="Prediction Error" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-xs text-slate-500 leading-relaxed">
              In DPCM, we quantize the <span className="text-rose-500 font-bold">Prediction Error</span> (red). 
              Because the error signal generally has a smaller amplitude range than the original signal (especially for low frequency/highly correlated signals), 
              we can use fewer bits to achieve similar quality, or get higher quality with the same bits.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PcmDpcm;