import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Check, X, Zap, ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { LineCodeType } from '../../types';

const CODE_DETAILS: Record<LineCodeType, { description: string; pros: string[]; cons: string[] }> = {
  [LineCodeType.UNIPOLAR_NRZ]: {
    description: "Binary '1' is represented by a high positive voltage (+V) and '0' by zero voltage (0V). The pulse remains constant throughout the entire bit interval (Non-Return-to-Zero).",
    pros: ["Simple to generate and implement", "Requires relatively low bandwidth"],
    cons: ["High DC component (wastes power, bad for AC coupling)", "No self-clocking (synchronization lost with long strings of 1s or 0s)"]
  },
  [LineCodeType.POLAR_NRZ]: {
    description: "Binary '1' is mapped to +V and '0' is mapped to -V. The signal is symmetric around the zero voltage level.",
    pros: ["Better noise immunity than Unipolar", "Reduced DC component (zero if 1s and 0s are balanced)"],
    cons: ["No self-clocking capability", "Synchronization issues persist for long identical sequences"]
  },
  [LineCodeType.UNIPOLAR_RZ]: {
    description: "Binary '1' is represented by a positive pulse for half the bit duration, returning to zero for the second half. '0' remains at zero.",
    pros: ["Spectral component at symbol rate aids timing recovery", "Simple generation"],
    cons: ["Requires twice the bandwidth of NRZ", "DC component is present", "Requires 3dB more power than Polar NRZ"]
  },
  [LineCodeType.BIPOLAR_RZ]: {
    description: "Also known as AMI (Alternate Mark Inversion). Binary '0' is 0V. Binary '1's alternate between +V and -V. Returns to zero in the middle of the bit period.",
    pros: ["No DC component (AC coupled)", "Occupies less bandwidth than Manchester", "Error detection capability (violation of alternation)"],
    cons: ["Synchronization lost with long strings of 0s", "Requires 3 voltage levels (+V, 0, -V)"]
  },
  [LineCodeType.MANCHESTER]: {
    description: "A transition occurs in the middle of every bit period. '1' is represented by a High-to-Low transition, and '0' by a Low-to-High transition (IEEE 802.3).",
    pros: ["Excellent self-clocking (transition every bit)", "No DC component"],
    cons: ["Requires twice the bandwidth of NRZ", "More complex encoding circuitry"]
  }
};

const LineCodes: React.FC = () => {
  const [inputBits, setInputBits] = useState("10110100");
  const [codeType, setCodeType] = useState<LineCodeType>(LineCodeType.UNIPOLAR_NRZ);
  const [chartData, setChartData] = useState<any[]>([]);

  // Logic to transform bits into waveform data based on coding scheme
  useEffect(() => {
    const bits = inputBits.split('').map(b => parseInt(b) || 0);
    const newData: any[] = [];
    
    // High voltage level
    const V = 1; 
    // -V for bipolar
    const negV = -1;

    let currentTime = 0;

    bits.forEach((bit, index) => {
      let startVal = 0;
      let endVal = 0;
      
      switch (codeType) {
        case LineCodeType.UNIPOLAR_NRZ:
          startVal = bit === 1 ? V : 0;
          endVal = startVal;
          newData.push({ time: currentTime, value: startVal });
          newData.push({ time: currentTime + 1, value: endVal });
          break;

        case LineCodeType.POLAR_NRZ:
          startVal = bit === 1 ? V : negV;
          endVal = startVal;
          newData.push({ time: currentTime, value: startVal });
          newData.push({ time: currentTime + 1, value: endVal });
          break;

        case LineCodeType.UNIPOLAR_RZ:
          if (bit === 1) {
            newData.push({ time: currentTime, value: V });
            newData.push({ time: currentTime + 0.5, value: V });
            newData.push({ time: currentTime + 0.5, value: 0 });
            newData.push({ time: currentTime + 1, value: 0 });
          } else {
            newData.push({ time: currentTime, value: 0 });
            newData.push({ time: currentTime + 1, value: 0 });
          }
          break;

        case LineCodeType.BIPOLAR_RZ:
          // AMI Logic: We need to track the polarity of the previous 1
          // Since this runs per bit in map, we need state. 
          // However, to keep it simple and reactive, we'll re-calculate previous ones implies O(N^2) or we assume standard pattern for demo.
          // Let's implement a quick state tracker outside the loop?
          // Actually, we can just iterate.
          break; 

        case LineCodeType.MANCHESTER:
          if (bit === 1) {
            newData.push({ time: currentTime, value: V });
            newData.push({ time: currentTime + 0.5, value: V });
            newData.push({ time: currentTime + 0.5, value: negV });
            newData.push({ time: currentTime + 1, value: negV });
          } else {
            newData.push({ time: currentTime, value: negV });
            newData.push({ time: currentTime + 0.5, value: negV });
            newData.push({ time: currentTime + 0.5, value: V });
            newData.push({ time: currentTime + 1, value: V });
          }
          break;
      }
      currentTime += 1;
    });

    // Handle Bipolar RZ separately to maintain state correctly
    if (codeType === LineCodeType.BIPOLAR_RZ) {
        // Reset data
        newData.length = 0;
        currentTime = 0;
        let lastPolarity = -1; // Start assuming last was negative so first is positive

        bits.forEach((bit) => {
            if (bit === 1) {
                const polarity = -lastPolarity;
                const level = polarity === 1 ? V : negV;
                newData.push({ time: currentTime, value: level });
                newData.push({ time: currentTime + 0.5, value: level });
                newData.push({ time: currentTime + 0.5, value: 0 });
                newData.push({ time: currentTime + 1, value: 0 });
                lastPolarity = polarity;
            } else {
                newData.push({ time: currentTime, value: 0 });
                newData.push({ time: currentTime + 1, value: 0 });
            }
            currentTime += 1;
        });
    }

    setChartData(newData);
  }, [inputBits, codeType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^01]/g, '');
    setInputBits(val);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Line Coding Techniques</h2>
        <p className="text-slate-600 mt-2">
          Explore how digital bits are converted into electrical signals for transmission. 
          Select a coding scheme on the right to visualize it.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Input Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Binary Input Sequence</label>
                <div className="flex items-center bg-white border border-slate-300 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                  <span className="text-slate-400 mr-2 font-mono text-sm">&gt;</span>
                  <input 
                    type="text" 
                    value={inputBits}
                    onChange={handleInputChange}
                    className="font-mono text-slate-800 outline-none w-full bg-transparent tracking-widest text-lg"
                    maxLength={16}
                    placeholder="Enter 1s and 0s"
                  />
                  <span className="text-xs text-slate-400 ml-2">{inputBits.length}/16</span>
                </div>
            </div>

            {/* Chart Area */}
            <div className="p-6 h-80 bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    type="number" 
                    domain={[0, 'dataMax']} 
                    tickCount={inputBits.length + 1} 
                    interval={0}
                    label={{ value: 'Time (Bit Periods)', position: 'bottom', offset: 0 }}
                  />
                  <YAxis domain={[-1.5, 1.5]} ticks={[-1, 0, 1]} hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px' }}
                    formatter={(val: number) => [val, 'Voltage']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={2} />
                  <Line 
                    type="stepAfter" 
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={false} 
                    animationDuration={300}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="text-center text-xs text-slate-400 mt-2">
                Visualization of {codeType}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Accordion List */}
        <div className="lg:col-span-1 space-y-3">
            {Object.values(LineCodeType).map((type) => {
              const isActive = codeType === type;
              const details = CODE_DETAILS[type];

              return (
                <div 
                  key={type}
                  onClick={() => setCodeType(type)}
                  className={`bg-white rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden ${
                    isActive 
                      ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                      : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  <div className={`px-4 py-3 flex items-center justify-between ${isActive ? 'bg-indigo-50' : 'bg-white'}`}>
                    <div className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded-full ${isActive ? 'bg-indigo-200 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                            {isActive ? <Activity size={16} /> : <Zap size={16} />}
                        </div>
                        <span className={`font-medium ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {type}
                        </span>
                    </div>
                    {isActive ? <ChevronUp size={16} className="text-indigo-500" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>

                  {isActive && (
                    <div className="px-4 py-4 border-t border-indigo-100 bg-white animate-fade-in text-sm">
                      <p className="text-slate-600 mb-4 leading-relaxed">
                        {details.description}
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                            <h5 className="font-semibold text-emerald-700 mb-1 flex items-center text-xs uppercase tracking-wide">
                                Advantages
                            </h5>
                            <ul className="space-y-1">
                                {details.pros.map((pro, i) => (
                                    <li key={i} className="flex items-start text-slate-600">
                                        <Check className="w-3.5 h-3.5 text-emerald-500 mr-2 mt-0.5 shrink-0" />
                                        <span>{pro}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h5 className="font-semibold text-rose-700 mb-1 flex items-center text-xs uppercase tracking-wide">
                                Disadvantages
                            </h5>
                            <ul className="space-y-1">
                                {details.cons.map((con, i) => (
                                    <li key={i} className="flex items-start text-slate-600">
                                        <X className="w-3.5 h-3.5 text-rose-500 mr-2 mt-0.5 shrink-0" />
                                        <span>{con}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

      </div>
    </div>
  );
};

export default LineCodes;