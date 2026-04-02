
import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, ScatterChart, Scatter, ZAxis, ReferenceLine, ReferenceArea, Cell 
} from 'recharts';
import { Waves, ArrowRight, Activity, Sigma, Clock, RotateCw } from 'lucide-react';

type Tab = 'fourier' | 'laplace' | 'ztransform' | 'mapping';

const Transforms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('fourier');
  const [damping, setDamping] = useState(0.5); // Controls decay for time domain

  // 1. Time Domain Data Generation (Common Reference)
  // Signal: e^(-at) * sin(2*pi*f*t)
  const timeData = useMemo(() => {
    const data = [];
    for (let t = 0; t <= 4; t += 0.05) {
      const val = Math.exp(-damping * t) * Math.sin(2 * Math.PI * 1 * t);
      data.push({ time: t, value: val });
    }
    return data;
  }, [damping]);

  // 2. Laplace S-Plane Data (Poles)
  // For e^(-at)sin(wt), poles are at s = -a +/- jw
  const sPlaneData = useMemo(() => {
    return [
      { real: -damping, imag: 1, type: 'Pole (X)' },
      { real: -damping, imag: -1, type: 'Pole (X)' }
    ];
  }, [damping]);

  // 3. Z-Plane Data
  // Mapping: z = e^(sT). Let T=0.5 for visualization scale.
  // z = e^(-aT) * e^(+/- jwT)
  // Magnitude (Radius) = e^(-aT). Angle = wT.
  const zPlaneData = useMemo(() => {
    const T = 1; // Sampling period normalized
    const r = Math.exp(-damping * T);
    // Angle corresponding to freq=1. 2*pi*1*T
    // We'll normalize angle for visual clarity to about 45 degrees (0.78 rad)
    const theta = 0.785; 
    
    return [
      { real: r * Math.cos(theta), imag: r * Math.sin(theta), label: 'Pole' },
      { real: r * Math.cos(-theta), imag: r * Math.sin(-theta), label: 'Pole' }
    ];
  }, [damping]);

  // Generate Unit Circle for Z-Plane visual
  const unitCircle = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 360; i+=10) {
      const rad = (i * Math.PI) / 180;
      points.push({ x: Math.cos(rad), y: Math.sin(rad) });
    }
    return points;
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Signals & Transforms</h2>
        <p className="text-slate-600">
          Understand how we transform signals from the Time Domain to Frequency (Fourier), Complex Frequency (Laplace), and Discrete Complex (Z) domains.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: 'fourier', label: 'Fourier', icon: <Waves size={18} /> },
          { id: 'laplace', label: 'Laplace (s-plane)', icon: <Activity size={18} /> },
          { id: 'ztransform', label: 'Z-Transform (z-plane)', icon: <RotateCw size={18} /> },
          { id: 'mapping', label: 'S to Z Mapping', icon: <ArrowRight size={18} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left: Visualization & Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shared Time Domain Reference */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-700 text-sm flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-indigo-500" /> Reference: Time Domain Signal
                </h3>
                <div className="flex items-center space-x-4">
                    <label className="text-xs text-slate-500">Damping Factor ($a$): {damping.toFixed(2)}</label>
                    <input 
                        type="range" min="0" max="2" step="0.1" 
                        value={damping}
                        onChange={(e) => setDamping(parseFloat(e.target.value))}
                        className="w-24 accent-indigo-600"
                    />
                </div>
            </div>
            <div className="h-40 w-full">
              <ResponsiveContainer>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={[-1, 1]} hide />
                  <Tooltip labelFormatter={(v) => `t=${v}`} />
                  <ReferenceLine y={0} stroke="#cbd5e1" />
                  <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Content Based on Tab */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
            
            {/* FOURIER CONTENT */}
            {activeTab === 'fourier' && (
              <div className="h-full flex flex-col">
                <h3 className="font-bold text-slate-800 mb-2">Frequency Domain Spectrum</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Decomposes the signal into its constituent sinusoidal frequencies. 
                    The damped sine wave has a peak frequency with spectral leakage (width) due to the damping.
                </p>
                <div className="flex-1">
                    <ResponsiveContainer>
                        <BarChart data={[
                            { f: 0.5, mag: 0.1 }, { f: 0.75, mag: 0.4 }, 
                            { f: 1.0, mag: 0.9 }, // Main freq
                            { f: 1.25, mag: 0.4 }, { f: 1.5, mag: 0.1 }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="f" label={{ value: 'Frequency (Hz)', position: 'bottom', offset: 0 }} />
                            <YAxis hide />
                            <Tooltip />
                            <Bar dataKey="mag" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* LAPLACE CONTENT */}
            {activeTab === 'laplace' && (
              <div className="h-full flex flex-col">
                <div className="flex justify-between">
                    <h3 className="font-bold text-slate-800 mb-2">S-Plane (Pole-Zero Plot)</h3>
                    <div className="text-xs flex items-center gap-2">
                        <span className="flex items-center"><span className="w-2 h-2 bg-emerald-100 border border-emerald-400 mr-1"></span> Stable Region (LHP)</span>
                    </div>
                </div>
                
                <div className="flex-1 relative">
                    <ResponsiveContainer>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="real" name="Real (σ)" domain={[-3, 3]} stroke="#94a3b8" />
                            <YAxis type="number" dataKey="imag" name="Imag (jω)" domain={[-2, 2]} stroke="#94a3b8" />
                            <ZAxis range={[100, 100]} />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <ReferenceLine x={0} stroke="#334155" strokeWidth={2} />
                            <ReferenceLine y={0} stroke="#334155" strokeWidth={1} />
                            
                            {/* Region of Stability (Left Half Plane) */}
                            <ReferenceArea x1={-10} x2={0} fill="#10b981" fillOpacity={0.1} />

                            <Scatter name="Poles" data={sPlaneData} fill="#ef4444" shape="cross" />
                        </ScatterChart>
                    </ResponsiveContainer>
                    <div className="absolute top-2 right-2 bg-white/90 p-2 text-xs border rounded shadow-sm">
                        Pole Location: {'$'}-\sigma \pm j\omega{'$'}<br/>
                        Real part = -{damping.toFixed(2)}
                    </div>
                </div>
              </div>
            )}

            {/* Z-TRANSFORM CONTENT */}
            {activeTab === 'ztransform' && (
              <div className="h-full flex flex-col">
                <div className="flex justify-between">
                    <h3 className="font-bold text-slate-800 mb-2">Z-Plane</h3>
                    <div className="text-xs flex items-center gap-2">
                        <span className="flex items-center"><div className="w-2 h-2 rounded-full border border-emerald-500 bg-emerald-100 mr-1"></div> Stable (Inside Circle)</span>
                    </div>
                </div>
                <div className="flex-1 relative">
                    <ResponsiveContainer>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="real" name="Real" domain={[-1.5, 1.5]} stroke="#94a3b8" />
                            <YAxis type="number" dataKey="imag" name="Imag" domain={[-1.5, 1.5]} stroke="#94a3b8" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <ReferenceLine x={0} stroke="#cbd5e1" />
                            <ReferenceLine y={0} stroke="#cbd5e1" />
                            
                            {/* Draw Unit Circle approx */}
                            <Scatter data={unitCircle} line={{ stroke: '#10b981', strokeWidth: 2 }} shape={() => <></>} isAnimationActive={false} />
                            
                            {/* Poles */}
                            <Scatter name="Poles" data={zPlaneData} fill="#ef4444" shape="cross" />
                        </ScatterChart>
                    </ResponsiveContainer>
                    <div className="absolute top-2 right-2 bg-white/90 p-2 text-xs border rounded shadow-sm">
                        Radius = e^(-aT) = {Math.exp(-damping).toFixed(2)}<br/>
                        {damping > 0 ? "Inside Circle (Stable)" : "On/Outside (Unstable)"}
                    </div>
                </div>
              </div>
            )}

            {/* MAPPING CONTENT */}
            {activeTab === 'mapping' && (
               <div className="h-full flex flex-col items-center justify-center p-4">
                  <div className="grid grid-cols-2 w-full gap-8 h-full">
                      <div className="border rounded-lg bg-slate-50 relative p-2 flex flex-col items-center justify-center">
                          <h4 className="absolute top-2 left-2 text-xs font-bold text-slate-500">S-Plane</h4>
                          <div className="w-32 h-48 border-r-2 border-slate-800 bg-emerald-100/50 relative">
                             <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                             {/* Arrow showing mapping direction */}
                             <div className="absolute right-0 top-1/4 w-full h-1 bg-red-500/20"></div>
                             <div className="absolute right-1 top-10 text-[10px] text-slate-600">jw axis</div>
                             <div className="absolute left-2 bottom-2 text-[10px] text-emerald-700 font-bold">Stable (LHP)</div>
                          </div>
                      </div>
                      
                      <div className="flex flex-col items-center justify-center">
                          <ArrowRight className="text-slate-400 mb-2" size={32} />
                          <div className="font-mono text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                              z = e^sT
                          </div>
                      </div>

                      <div className="border rounded-lg bg-slate-50 relative p-2 flex flex-col items-center justify-center col-span-2 md:col-span-1">
                          <h4 className="absolute top-2 left-2 text-xs font-bold text-slate-500">Z-Plane</h4>
                          <div className="w-40 h-40 rounded-full border-2 border-slate-800 bg-emerald-100/50 flex items-center justify-center relative">
                              <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                              <div className="absolute top-2 text-[10px] text-slate-600">Unit Circle</div>
                              <div className="text-[10px] text-emerald-700 font-bold">Stable (Inside)</div>
                          </div>
                      </div>
                  </div>
                  <p className="mt-4 text-center text-sm text-slate-600">
                      The imaginary axis ($j\omega$) in the Laplace domain maps to the <strong>Unit Circle</strong> in the Z-domain. 
                      The left-half stable plane maps to the <strong>interior</strong> of the unit circle.
                  </p>
               </div>
            )}

          </div>
        </div>

        {/* Right: Theory & Math */}
        <div className="space-y-6">
            <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Sigma className="mr-2" /> Mathematical Definition
                </h3>
                
                {activeTab === 'fourier' && (
                    <div className="space-y-4">
                        <div className="bg-indigo-800/50 p-3 rounded font-mono text-sm overflow-x-auto">
                            {"F(j\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-j\\omega t}dt"}
                        </div>
                        <p className="text-sm text-indigo-100 leading-relaxed">
                            <strong>Fourier Transform:</strong> Converts a continuous time signal into the frequency domain. It assumes the signal exists for all time.
                        </p>
                    </div>
                )}

                {activeTab === 'laplace' && (
                    <div className="space-y-4">
                         <div className="bg-indigo-800/50 p-3 rounded font-mono text-sm overflow-x-auto">
                            {"F(s) = \\int_{0}^{\\infty} f(t)e^{-st}dt"}
                        </div>
                        <p className="text-sm text-indigo-100 leading-relaxed">
                            <strong>Laplace Transform:</strong> Generalizes Fourier for transient signals. 
                            <br/>Variable: {'$s = \\sigma + j\\omega$'}
                        </p>
                    </div>
                )}

                {activeTab === 'ztransform' && (
                    <div className="space-y-4">
                        <div className="bg-indigo-800/50 p-3 rounded font-mono text-sm overflow-x-auto">
                            {"X(z) = \\sum_{n=-\\infty}^{\\infty} x[n]z^{-n}"}
                        </div>
                        <p className="text-sm text-indigo-100 leading-relaxed">
                            <strong>Z-Transform:</strong> The discrete-time equivalent of Laplace. Used for digital signals and control systems.
                        </p>
                    </div>
                )}

                {activeTab === 'mapping' && (
                     <div className="space-y-4">
                        <div className="bg-indigo-800/50 p-3 rounded font-mono text-sm overflow-x-auto">
                            {"z = e^{sT}"}
                        </div>
                        <ul className="text-sm text-indigo-100 space-y-2 list-disc list-inside">
                            <li>$s = 0 \rightarrow z = 1$</li>
                            <li>$s = j\omega \rightarrow |z| = 1$ (Unit Circle)</li>
                            <li>$\sigma &lt; 0 \rightarrow |z| &lt; 1$ (Stable)</li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-3">Key Takeaways</h4>
                <ul className="space-y-3 text-sm text-slate-600">
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        <span><strong>Fourier</strong> tells us *what frequencies* exist.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        <span><strong>Laplace</strong> analyzes stability of continuous systems (circuits).</span>
                    </li>
                    <li className="flex items-start">
                        <span className="mr-2 text-indigo-500">•</span>
                        <span><strong>Z-Transform</strong> analyzes stability of digital systems (computers/DSP).</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Transforms;
