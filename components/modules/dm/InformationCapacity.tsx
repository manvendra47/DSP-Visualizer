import React, { useState } from 'react';
import { Calculator, Info } from 'lucide-react';

const InformationCapacity: React.FC = () => {
  const [bandwidth, setBandwidth] = useState(3000); // Hz
  const [snrDb, setSnrDb] = useState(30); // dB
  const [levels, setLevels] = useState(4); // M levels

  // Shannon's Formula: C = B * log2(1 + S/N)
  // S/N must be linear, not dB
  const snrLinear = Math.pow(10, snrDb / 10);
  const shannonCapacity = bandwidth * Math.log2(1 + snrLinear);

  // Nyquist Minimum Bandwidth for M-ary: B = fb / (2 * log2(M)) -> fb = 2 * B * log2(M)
  // This calculates max bit rate for a noiseless channel
  const bitsPerSymbol = Math.log2(levels);
  const nyquistCapacity = 2 * bandwidth * bitsPerSymbol;

  // Baud calculation for M-ary
  // Baud = BitRate / N, where N = log2(M)
  // Let's assume we are transmitting at Shannon capacity
  const transmissionBitRate = shannonCapacity; 
  const baudRate = transmissionBitRate / (bitsPerSymbol || 1);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Information Capacity</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Information capacity is a measure of how much information can be propagated through a communication system. 
          It is fundamentally limited by bandwidth (B) and signal-to-noise ratio (SNR).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
            <h3 className="font-semibold text-slate-800 flex items-center border-b pb-3">
                <Calculator className="w-5 h-5 mr-2 text-indigo-600" /> Parameters
            </h3>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bandwidth (B): <span className="text-indigo-600 font-bold">{bandwidth.toLocaleString()} Hz</span>
                </label>
                <input 
                    type="range" min="1000" max="20000" step="100"
                    value={bandwidth}
                    onChange={(e) => setBandwidth(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Signal-to-Noise Ratio (S/N): <span className="text-indigo-600 font-bold">{snrDb} dB</span>
                </label>
                <input 
                    type="range" min="0" max="60" step="1"
                    value={snrDb}
                    onChange={(e) => setSnrDb(parseInt(e.target.value))}
                    className="w-full accent-indigo-600"
                />
                <div className="text-xs text-slate-500 mt-1">
                    Linear S/N Ratio: {snrLinear.toFixed(1)}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    M-ary Levels (M): <span className="text-indigo-600 font-bold">{levels}</span>
                </label>
                <select 
                    value={levels}
                    onChange={(e) => setLevels(parseInt(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-slate-700"
                >
                    <option value="2">2 (Binary)</option>
                    <option value="4">4 (2 bits/symbol)</option>
                    <option value="8">8 (3 bits/symbol)</option>
                    <option value="16">16 (4 bits/symbol)</option>
                    <option value="32">32 (5 bits/symbol)</option>
                    <option value="64">64 (6 bits/symbol)</option>
                </select>
                <div className="text-xs text-slate-500 mt-1">
                    N = log₂M = {bitsPerSymbol} bits per symbol
                </div>
            </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
            
            {/* Shannon */}
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-indigo-900">Shannon's Limit</h3>
                    <div className="bg-indigo-200 text-indigo-800 text-xs px-2 py-1 rounded font-mono">
                        C = B log₂(1 + S/N)
                    </div>
                </div>
                <div className="text-4xl font-extrabold text-indigo-600 mb-2">
                    {(shannonCapacity / 1000).toFixed(2)} <span className="text-xl font-normal text-indigo-400">kbps</span>
                </div>
                <p className="text-sm text-indigo-800 opacity-80">
                    The theoretical maximum data rate for a noisy channel.
                </p>
            </div>

            {/* Nyquist/Hartley */}
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-emerald-900">Nyquist Noiseless Limit</h3>
                    <div className="bg-emerald-200 text-emerald-800 text-xs px-2 py-1 rounded font-mono">
                        C = 2 B log₂M
                    </div>
                </div>
                <div className="text-4xl font-extrabold text-emerald-600 mb-2">
                     {(nyquistCapacity / 1000).toFixed(2)} <span className="text-xl font-normal text-emerald-400">kbps</span>
                </div>
                <p className="text-sm text-emerald-800 opacity-80">
                    Maximum rate for a noise-free channel using M levels.
                </p>
            </div>
            
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
         <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Bit Rate vs. Baud</h3>
            <p className="text-slate-600 text-sm mb-4">
                <strong>Bit Rate ($R_b$):</strong> The number of bits transmitted per second.<br/>
                <strong>Baud:</strong> The rate of change of the signal (symbols per second).
            </p>
            <div className="bg-slate-100 p-3 rounded text-sm font-mono text-slate-700">
                Baud = Bit Rate / N
            </div>
         </div>
         <div className="bg-white p-4 rounded-lg border border-slate-200">
             <div className="text-sm text-slate-500 mb-1">If transmitting at Shannon Cap:</div>
             <div className="flex justify-between items-end">
                <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase">Bit Rate</div>
                    <div className="font-mono text-lg text-slate-800">{(shannonCapacity).toFixed(0)} bps</div>
                </div>
                <div className="text-2xl text-slate-300">/ {bitsPerSymbol} =</div>
                <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase">Baud Rate</div>
                    <div className="font-mono text-lg text-indigo-600">{(baudRate).toFixed(0)} symbols/s</div>
                </div>
             </div>
         </div>
      </div>
    </div>
  );
};

export default InformationCapacity;