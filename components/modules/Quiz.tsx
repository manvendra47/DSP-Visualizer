import React, { useState } from 'react';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../../types';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Which process converts discrete time samples into discrete amplitude values?",
    options: ["Sampling", "Quantization", "Encoding", "Filtering"],
    correctAnswer: 1,
    explanation: "Quantization approximates infinite amplitude values to a finite set of known values."
  },
  {
    id: 2,
    question: "What is the Nyquist Rate for a signal with max frequency 4000 Hz?",
    options: ["2000 Hz", "4000 Hz", "8000 Hz", "16000 Hz"],
    correctAnswer: 2,
    explanation: "Nyquist Rate = 2 * Fm. So, 2 * 4000 Hz = 8000 Hz."
  },
  {
    id: 3,
    question: "Which line code has a transition in the middle of every bit period?",
    options: ["NRZ-L", "Unipolar RZ", "Manchester", "AMI"],
    correctAnswer: 2,
    explanation: "Manchester coding ensures a transition in the middle of the bit period, providing self-clocking."
  },
  {
    id: 4,
    question: "In Delta Modulation, what causes 'Slope Overload'?",
    options: ["Step size is too large", "Step size is too small", "Sampling rate is too high", "Signal is too weak"],
    correctAnswer: 1,
    explanation: "If the step size is too small to keep up with a rapidly changing input signal, slope overload occurs."
  },
  {
    id: 5,
    question: "What is the advantage of Adaptive Delta Modulation (ADM) over DM?",
    options: ["Uses less bandwidth", "Adjusts step size dynamically", "Removes the need for a filter", "Works without sampling"],
    correctAnswer: 1,
    explanation: "ADM adjusts the step size based on the signal's slope: larger steps for steep slopes, smaller steps for flat areas."
  },
  {
    id: 6,
    question: "What is the primary purpose of Companding in PCM?",
    options: ["To increase bandwidth", "To improve SNR for weak signals", "To reduce sampling rate", "To eliminate channel noise"],
    correctAnswer: 1,
    explanation: "Companding (Compressing + Expanding) uses non-uniform quantization to improve the Signal-to-Noise Ratio for low-amplitude signals."
  },
  {
    id: 7,
    question: "Which three functions are performed by a Regenerative Repeater?",
    options: ["Amplification, Filtering, Modulation", "Equalizing, Timing, Decision Making", "Sampling, Quantizing, Encoding", "Compression, Expansion, Transmission"],
    correctAnswer: 1,
    explanation: "A regenerative repeater equalizes the distorted pulse, derives timing information, and makes a decision to regenerate a clean binary pulse."
  },
  {
    id: 8,
    question: "In a DPCM transmitter, what is the input to the Quantizer?",
    options: ["The original analog signal", "The predicted signal", "The prediction error", "The binary code"],
    correctAnswer: 2,
    explanation: "DPCM quantizes the difference (error) between the actual sample and the predicted value, not the absolute sample value."
  },
  {
    id: 9,
    question: "How does the Output SNR of a PCM system relate to the number of bits (n)?",
    options: ["SNR decreases linearly with n", "SNR increases exponentially with n", "SNR is independent of n", "SNR is halved for every bit added"],
    correctAnswer: 1,
    explanation: "The SNR increases exponentially with the number of bits. Adding 1 bit improves SNR by approximately 6 dB."
  },
  {
    id: 10,
    question: "Which line code uses three voltage levels (+V, 0, -V) and alternates polarity for binary 1s?",
    options: ["Unipolar NRZ", "Polar NRZ", "Bipolar RZ (AMI)", "Manchester"],
    correctAnswer: 2,
    explanation: "Bipolar RZ (AMI) represents binary 0 as 0V and binary 1s as alternating +V and -V pulses, returning to zero mid-bit."
  }
];

const Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const score = questions.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Knowledge Check</h2>
        <p className="text-slate-600 mt-2">Test your understanding of PCM systems.</p>
      </div>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-lg mb-4 flex items-start">
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded mr-3 mt-1">
                Q{index + 1}
              </span>
              {q.question}
            </h3>
            
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isSelected = answers[q.id] === idx;
                const isCorrect = q.correctAnswer === idx;
                
                let btnClass = "w-full text-left px-4 py-3 rounded-lg border transition-all ";
                
                if (showResults) {
                  if (isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-800 font-medium";
                  else if (isSelected && !isCorrect) btnClass += "bg-rose-50 border-rose-500 text-rose-800";
                  else btnClass += "bg-slate-50 border-slate-200 opacity-60";
                } else {
                  if (isSelected) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-700 font-medium";
                  else btnClass += "bg-white border-slate-200 hover:bg-slate-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(q.id, idx)}
                    className={btnClass}
                  >
                    <div className="flex justify-between items-center">
                      <span>{opt}</span>
                      {showResults && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                      {showResults && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResults && (
              <div className="mt-4 p-3 bg-slate-50 text-sm text-slate-600 rounded border-l-4 border-indigo-400">
                <strong>Explanation:</strong> {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-4 pb-12">
        {!showResults ? (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(answers).length < questions.length}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Submit Answers
          </button>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-slate-900">
              Score: {score} / {questions.length}
            </div>
            <button
              onClick={() => {
                setAnswers({});
                setShowResults(false);
                window.scrollTo(0,0);
              }}
              className="flex items-center justify-center mx-auto text-indigo-600 font-medium hover:text-indigo-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;