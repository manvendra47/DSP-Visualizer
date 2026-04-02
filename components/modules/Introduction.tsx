import React from 'react';
import { ArrowRight, CheckCircle, Zap, Cpu, Activity } from 'lucide-react';

interface IntroductionProps {
  onNext: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onNext }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Introduction to PCM</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          Pulse Code Modulation (PCM) is the process of varying one or more parameters of a carrier signal 
          in accordance with the instantaneous values of the message signal. It is the standard method 
          for converting analog audio into digital data (1s and 0s) for long-distance transmission without noise accumulation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-indigo-600 mb-3">Why Digital Transmission?</h3>
          <ul className="space-y-2">
            {[
              'Robustness against channel noise',
              'Ease of regeneration using repeaters',
              'Efficient storage and processing',
              'Integration with other digital data'
            ].map((item, idx) => (
              <li key={idx} className="flex items-start text-slate-700 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-1 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-indigo-600 mb-3">Core Process</h3>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 text-sm">
            <li><span className="font-medium">Sampling:</span> Discretize time (T intervals).</li>
            <li><span className="font-medium">Quantization:</span> Discretize amplitude (Finite levels).</li>
            <li><span className="font-medium">Encoding:</span> Convert levels to binary (n bits).</li>
            <li><span className="font-medium">Regeneration:</span> Eliminate noise at repeaters.</li>
          </ol>
        </div>
      </div>

      <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-100">
        <h3 className="text-center text-lg font-bold text-indigo-900 mb-6">The PCM Workflow</h3>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm font-medium">
          <div className="bg-white px-4 py-3 rounded shadow text-center w-32">Analog<br/>Input</div>
          <ArrowRight className="text-indigo-300 hidden md:block" />
          <ArrowRight className="text-indigo-300 md:hidden transform rotate-90" />
          <div className="bg-indigo-600 text-white px-4 py-3 rounded shadow text-center w-32">Sampler<br/>(Hold)</div>
          <ArrowRight className="text-indigo-300 hidden md:block" />
          <ArrowRight className="text-indigo-300 md:hidden transform rotate-90" />
          <div className="bg-indigo-600 text-white px-4 py-3 rounded shadow text-center w-32">Quantizer</div>
          <ArrowRight className="text-indigo-300 hidden md:block" />
          <ArrowRight className="text-indigo-300 md:hidden transform rotate-90" />
          <div className="bg-indigo-600 text-white px-4 py-3 rounded shadow text-center w-32">Encoder</div>
          <ArrowRight className="text-indigo-300 hidden md:block" />
          <ArrowRight className="text-indigo-300 md:hidden transform rotate-90" />
          <div className="bg-white px-4 py-3 rounded shadow text-center w-32">Binary<br/>Output</div>
        </div>
        <p className="text-center text-slate-500 mt-6 text-xs italic">
          "A signal is pulse code modulated to convert its analog information into a binary sequence."
        </p>
      </div>

      {/* Circuit Details Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Circuit Implementation Details</h3>
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Sampler Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center space-x-2">
              <Activity className="text-blue-600 w-5 h-5" />
              <h4 className="font-semibold text-blue-900">Sampler Circuit</h4>
            </div>
            <div className="p-5 text-sm text-slate-600 space-y-3">
              <p>
                <strong>The Sample & Hold (S/H) Circuit:</strong> This is the first stage. It utilizes a switch (typically a Transistor or FET) and a Capacitor.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  <span className="font-semibold text-slate-700">Sampling:</span> When the clock is high, the switch closes. The capacitor rapidly charges to the instantaneous input voltage.
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Holding:</span> When the switch opens, the capacitor retains the charge, holding the voltage constant ("Flat Top") long enough for the ADC to process it.
                </li>
              </ul>
            </div>
          </div>

          {/* Quantizer Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-purple-50 p-4 border-b border-purple-100 flex items-center space-x-2">
              <Zap className="text-purple-600 w-5 h-5" />
              <h4 className="font-semibold text-purple-900">Quantizer Circuit</h4>
            </div>
            <div className="p-5 text-sm text-slate-600 space-y-3">
              <p>
                <strong>Comparators & Reference Ladder:</strong> This stage approximates the held voltage to the nearest discrete level.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  <span className="font-semibold text-slate-700">Resistor Ladder:</span> A chain of resistors divides a reference voltage into <span className="font-mono">L</span> precise levels.
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Comparators:</span> A bank of operational amplifiers (Op-Amps) compares the input sample against these reference levels to determine which "Zone" the signal is in.
                </li>
              </ul>
            </div>
          </div>

          {/* Encoder Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center space-x-2">
              <Cpu className="text-emerald-600 w-5 h-5" />
              <h4 className="font-semibold text-emerald-900">Encoder Circuit</h4>
            </div>
            <div className="p-5 text-sm text-slate-600 space-y-3">
              <p>
                <strong>Logic Gates & Registers:</strong> Converts the quantization level into a binary code.
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  <span className="font-semibold text-slate-700">Priority Encoder:</span> Digital logic gates take the output from the comparators and generate a parallel binary number (e.g., 3 bits for 8 levels).
                </li>
                <li>
                  <span className="font-semibold text-slate-700">Parallel-to-Serial:</span> A shift register converts the parallel bits into a serial stream of pulses for transmission over the wire.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={onNext}
          className="group bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center"
        >
          Start Digitization
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default Introduction;