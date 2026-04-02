
import React from 'react';
import { Activity, Radio, ArrowRight, Cpu, Wifi, Waves } from 'lucide-react';
import { DomainId } from '../types';

interface GlobalIntroProps {
  onSelectDomain: (domain: DomainId) => void;
}

const GlobalIntro: React.FC<GlobalIntroProps> = ({ onSelectDomain }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-7xl w-full flex flex-col gap-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
            Communication <span className="text-indigo-600">Systems</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Master the fundamentals of modern telecommunications. Select a domain below to explore interactive visualizations and real-time simulations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* PCM Card */}
          <button 
            onClick={() => onSelectDomain(DomainId.PCM)}
            className="group relative bg-white p-8 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-indigo-500 hover:shadow-xl transition-all duration-300 text-left flex flex-col"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={120} className="text-indigo-600" />
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Cpu size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700">PCM Master</h2>
            <p className="text-slate-600 mb-6 flex-grow">
              Pulse Code Modulation, Sampling Theorem, Quantization, Line Codes, and Delta Modulation.
            </p>
            <div className="flex items-center font-semibold text-indigo-600 group-hover:translate-x-2 transition-transform mt-auto">
              Start PCM Course <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </button>

          {/* Digital Modulation Card */}
          <button 
            onClick={() => onSelectDomain(DomainId.DIGITAL_MODULATION)}
            className="group relative bg-white p-8 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 text-left flex flex-col"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Radio size={120} className="text-emerald-600" />
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wifi size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700">Digital Modulation</h2>
            <p className="text-slate-600 mb-6 flex-grow">
              ASK, FSK, PSK, QAM, Information Capacity (Shannon/Hartley), and Constellation Diagrams.
            </p>
            <div className="flex items-center font-semibold text-emerald-600 group-hover:translate-x-2 transition-transform mt-auto">
              Start Modulation Course <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </button>

          {/* Transforms Card */}
          <button 
            onClick={() => onSelectDomain(DomainId.TRANSFORMS)}
            className="group relative bg-white p-8 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-violet-500 hover:shadow-xl transition-all duration-300 text-left flex flex-col"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Waves size={120} className="text-violet-600" />
            </div>
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-6 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Activity size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-violet-700">Signals & Systems</h2>
            <p className="text-slate-600 mb-6 flex-grow">
              Visualizing Fourier (Frequency), Laplace (S-Plane), and Z-Transforms (Z-Plane) and their mapping.
            </p>
            <div className="flex items-center font-semibold text-violet-600 group-hover:translate-x-2 transition-transform mt-auto">
              Explore Transforms <ArrowRight className="ml-2 w-4 h-4" />
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};

export default GlobalIntro;
