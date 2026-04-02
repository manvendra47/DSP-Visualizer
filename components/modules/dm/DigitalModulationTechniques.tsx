
import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ScatterChart, Scatter, Cell, ReferenceLine, ZAxis } from 'recharts';
import { CheckCircle, XCircle, Globe, Radio, Zap } from 'lucide-react';
import { ModulationType } from '../../../types';
import { WaveformPoint, ConstellationPoint, TechniqueInfo } from './techniques/types';

// Import Strategies
import { ASK_INFO, generateAskWaveform, generateAskConstellation } from './techniques/ask';
import { FSK_INFO, generateFskWaveform, generateFskConstellation } from './techniques/fsk';
import { BPSK_INFO, QPSK_INFO, generatePskWaveform, generatePskConstellation } from './techniques/psk';
import { QAM_INFO, generateQamWaveform, generateQamConstellation } from './techniques/qam';

const DigitalModulationTechniques: React.FC = () => {
  const [modType, setModType] = useState<ModulationType>(ModulationType.ASK);
  const [pskVariant, setPskVariant] = useState<'BPSK' | 'QPSK'>('BPSK');
  const [bitSequence, setBitSequence] = useState('101101');
  
  // Strategy Selector
  const { info, waveformData, constellationData } = useMemo(() => {
    let info: TechniqueInfo;
    let waveformData: WaveformPoint[];
    let constellationData: ConstellationPoint[];

    switch (modType) {
      case ModulationType.ASK:
        info = ASK_INFO;
        waveformData = generateAskWaveform(bitSequence);
        constellationData = generateAskConstellation();
        break;
      case ModulationType.FSK:
        info = FSK_INFO;
        waveformData = generateFskWaveform(bitSequence);
        constellationData = generateFskConstellation();
        break;
      case ModulationType.PSK:
        // Switch between BPSK and QPSK info/generators based on state
        if (pskVariant === 'QPSK') {
            info = QPSK_INFO;
        } else {
            info = BPSK_INFO;
        }
        waveformData = generatePskWaveform(bitSequence, pskVariant);
        constellationData = generatePskConstellation(pskVariant);
        break;
      case ModulationType.QAM:
        info = QAM_INFO;
        waveformData = generateQamWaveform(bitSequence);
        constellationData = generateQamConstellation();
        break;
      default:
        // Fallback
        info = ASK_INFO;
        waveformData = [];
        constellationData = [];
    }

    return { info, waveformData, constellationData };
  }, [modType, bitSequence, pskVariant]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Selection */}
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-slate-200 pb-6 gap-4">
        <div>
            <h2 className="text-3xl font-bold text-slate-900">Modulation Visualizer</h2>
            <p className="text-slate-600 mt-2">
              Select a modulation technique to visualize its waveform, constellation, and learn about its real-world applications.
            </p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <div className="flex bg-slate-100 p-1.5 rounded-xl shadow-inner">
                {(Object.values(ModulationType) as ModulationType[]).map((type) => (
                    <button
                        key={type}
                        onClick={() => setModType(type)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            modType === type 
                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>
            {/* Sub-selector for PSK Variants */}
            {modType === ModulationType.PSK && (
                 <div className="flex bg-indigo-50 p-1 rounded-lg border border-indigo-100 animate-fade-in">
                    <button 
                        onClick={() => setPskVariant('BPSK')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${pskVariant === 'BPSK' ? 'bg-indigo-600 text-white shadow' : 'text-indigo-600 hover:bg-indigo-100'}`}
                    >
                        BPSK
                    </button>
                    <button 
                        onClick={() => setPskVariant('QPSK')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${pskVariant === 'QPSK' ? 'bg-indigo-600 text-white shadow' : 'text-indigo-600 hover:bg-indigo-100'}`}
                    >
                        QPSK
                    </button>
                 </div>
            )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Waveform Visualization Panel */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <Radio className="text-indigo-600 w-5 h-5" />
                        <h3 className="font-semibold text-slate-800">Time Domain Signal</h3>
                    </div>
                    
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                        <span className="text-xs font-bold text-slate-400 uppercase mr-3">Input Bits</span>
                        <input 
                            type="text" 
                            maxLength={8}
                            value={bitSequence}
                            onChange={(e) => setBitSequence(e.target.value.replace(/[^01]/g, ''))}
                            className="font-mono text-slate-800 bg-transparent outline-none w-24 tracking-widest"
                        />
                    </div>
                </div>
                
                <div className="h-72 w-full">
                    {modType !== ModulationType.QAM ? (
                        <ResponsiveContainer>
                            <LineChart data={waveformData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={[-1.5, 1.5]} hide />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelFormatter={() => ''} 
                                />
                                <ReferenceLine y={0} stroke="#cbd5e1" />
                                {pskVariant === 'BPSK' && (
                                    <Line 
                                        type="step" 
                                        dataKey="bit" 
                                        stroke="#94a3b8" 
                                        strokeWidth={1.5} 
                                        strokeDasharray="5 5"
                                        dot={false} 
                                        name="Digital Bit"
                                    />
                                )}
                                <Line 
                                    type="monotone" 
                                    dataKey="modulated" 
                                    stroke="#4f46e5" 
                                    strokeWidth={2.5} 
                                    dot={false} 
                                    name="Modulated Output"
                                    animationDuration={300}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                           <Globe className="w-12 h-12 mb-2 opacity-50" />
                           <p className="text-sm font-medium">QAM involves complex phase/amplitude mixing.</p>
                           <p className="text-xs">Please view the Constellation Diagram.</p>
                        </div>
                    )}
                </div>
                <div className="flex justify-center mt-4 space-x-6 text-xs font-medium">
                    {pskVariant === 'BPSK' && (
                        <div className="flex items-center text-slate-400">
                            <div className="w-4 h-0.5 bg-slate-400 border border-dashed mr-2"></div> Binary Input
                        </div>
                    )}
                    <div className="flex items-center text-indigo-600">
                        <div className="w-4 h-0.5 bg-indigo-600 mr-2"></div> Modulated Carrier
                    </div>
                </div>
            </div>

            {/* Technique Overview Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">{info.name} Overview</h3>
                </div>
                
                <div className="p-6 space-y-6">
                    <p className="text-slate-600 leading-relaxed">
                        {info.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-3 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1.5" /> Advantages
                            </h4>
                            <ul className="space-y-2">
                                {info.pros.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 mr-2 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-3 flex items-center">
                                <XCircle className="w-4 h-4 mr-1.5" /> Disadvantages
                            </h4>
                            <ul className="space-y-2">
                                {info.cons.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start">
                                        <span className="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 mr-2 shrink-0"></span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3 flex items-center">
                             <Globe className="w-4 h-4 mr-1.5" /> Common Applications
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {info.useCases.map((useCase, i) => (
                                <span key={i} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full font-medium border border-indigo-100">
                                    {useCase}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar: Constellation & Math */}
        <div className="space-y-6">
            
            {/* Constellation Diagram */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-80 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                     <h3 className="font-semibold text-slate-700 text-sm">Constellation Diagram</h3>
                     <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Signal Space</span>
                </div>
               
                <div className="flex-1 w-full relative">
                    <ResponsiveContainer>
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="i" name="In-Phase (I)" domain={[-1.5, 1.5]} tickCount={3} stroke="#94a3b8" />
                            <YAxis type="number" dataKey="q" name="Quadrature (Q)" domain={[-1.5, 1.5]} tickCount={3} stroke="#94a3b8" />
                            <ZAxis type="number" range={[100, 100]} />
                            <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px' }} />
                            <ReferenceLine x={0} stroke="#cbd5e1" strokeWidth={2} />
                            <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={2} />
                            <Scatter name="Symbols" data={constellationData} fill="#4f46e5">
                                {constellationData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={'#4f46e5'} />
                                ))}
                            </Scatter>
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center text-xs text-slate-400 mt-2">
                    {pskVariant === 'QPSK' ? 'QPSK uses 4 phases to encode 2 bits.' : 'BPSK uses 2 phases to encode 1 bit.'}
                </div>
            </div>
            
            {/* Equation Box */}
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                <div className="flex items-center mb-4 opacity-90">
                    <Zap className="w-5 h-5 mr-2" />
                    <span className="text-sm font-bold uppercase tracking-wider">Mathematical Model</span>
                </div>
                <div className="bg-indigo-800/50 p-4 rounded-xl border border-indigo-400/30 text-center font-mono text-sm overflow-x-auto whitespace-nowrap">
                    {info.equation}
                </div>
                <p className="mt-4 text-xs text-indigo-200 leading-relaxed">
                    This equation governs how the carrier signal is modified by the message signal over time.
                </p>
            </div>

            {/* Quick Summary */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-sm text-slate-600">
                 <p>
                    <strong>Note:</strong> {modType === ModulationType.ASK ? 'Amplitude' : modType === ModulationType.FSK ? 'Frequency' : 'Phase'} acts as the information carrier. 
                    Receiver circuitry must be designed to detect these specific variations while ignoring others.
                 </p>
            </div>

        </div>

      </div>
    </div>
  );
};

export default DigitalModulationTechniques;
