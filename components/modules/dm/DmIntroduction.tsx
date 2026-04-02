import React from 'react';
import { Signal, ArrowRight, ShieldCheck, Cpu, Layers } from 'lucide-react';

const DmIntroduction: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Digital Modulation Fundamentals</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Digital modulation is the transmittal of digitally modulated analog signals between two or more points. 
          Unlike analog modulation, the information signal is digital (binary data), which modulates a high-frequency analog carrier.
        </p>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8">
        <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
            <Signal className="mr-2" /> Basic Concept
        </h3>
        <p className="text-emerald-800 leading-relaxed mb-6">
            If v(t) = V *sin(2*pi*f *t + theta)  represents the carrier signal, we can produce digital modulation by varying:
        </p>
        <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-bold text-slate-800 mb-1">Amplitude (V)</div>
                <div className="text-sm text-slate-500">Amplitude Shift Keying (ASK)</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-bold text-slate-800 mb-1">Frequency (f)</div>
                <div className="text-sm text-slate-500">Frequency Shift Keying (FSK)</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="font-bold text-slate-800 mb-1">Phase ($\theta$)</div>
                <div className="text-sm text-slate-500">Phase Shift Keying (PSK)</div>
            </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-indigo-600 mb-3 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2" />
            Key Advantages
          </h3>
          <ul className="space-y-3 text-slate-700 text-sm">
            <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span><strong>High Noise Immunity:</strong> Digital signals are easier to regenerate and less susceptible to interference than analog signals.</span>
            </li>
            <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span><strong>Ease of Multiplexing:</strong> Supports efficient sharing of channels via TDM, FDM, and CDM.</span>
            </li>
            <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span><strong>Security:</strong> Easier to encrypt and integrate with digital signal processors (DSP).</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-indigo-600 mb-3 flex items-center">
            <Layers className="w-5 h-5 mr-2" />
            Performance Criteria
          </h3>
          <ul className="space-y-3 text-slate-700 text-sm">
            <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span><strong>Spectral Efficiency:</strong> Bits per second per Hz ($\eta = R_b/B$). High is better.</span>
            </li>
            <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span><strong>Power Efficiency:</strong> Ability to achieve low Bit Error Rate (BER) with minimal power ($E_b/N_0$).</span>
            </li>
            <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 mr-2 shrink-0"></span>
                <span><strong>Robustness to Multipath:</strong> Resistance to fading caused by signal reflections (echoes).</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
        <h3 className="text-center text-lg font-bold text-slate-900 mb-8">Simplified Block Diagram</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-medium">
          <div className="bg-white px-4 py-3 rounded shadow text-center w-32 border border-slate-200">Digital<br/>Data</div>
          <ArrowRight className="text-slate-400 hidden md:block" />
          <ArrowRight className="text-slate-400 md:hidden transform rotate-90" />
          <div className="bg-indigo-600 text-white px-4 py-3 rounded shadow text-center w-32">Precoder /<br/>Encoder</div>
          <ArrowRight className="text-slate-400 hidden md:block" />
          <ArrowRight className="text-slate-400 md:hidden transform rotate-90" />
          <div className="bg-emerald-600 text-white px-4 py-3 rounded shadow text-center w-32">Modulator</div>
          <ArrowRight className="text-slate-400 hidden md:block" />
          <ArrowRight className="text-slate-400 md:hidden transform rotate-90" />
          <div className="bg-white px-4 py-3 rounded shadow text-center w-32 border border-slate-200">Bandpass<br/>Filter</div>
          <ArrowRight className="text-slate-400 hidden md:block" />
          <ArrowRight className="text-slate-400 md:hidden transform rotate-90" />
          <div className="flex items-center text-slate-500 italic">Channel</div>
        </div>
      </div>
    </div>
  );
};

export default DmIntroduction;