
import React from 'react';
import { 
  BookOpen, Activity, Binary, TrendingUp, BrainCircuit, Scale, Zap, 
  Radio, BarChart, ChevronLeft, Waves, Sigma
} from 'lucide-react';
import { ModuleId, DomainId } from '../types';

interface SidebarProps {
  activeModule: ModuleId;
  setActiveModule: (id: ModuleId) => void;
  activeDomain: DomainId;
  onSwitchDomain: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, activeDomain, onSwitchDomain }) => {
  
  const pcmItems = [
    { id: ModuleId.INTRODUCTION, label: 'PCM Fundamentals', icon: <BookOpen size={20} /> },
    { id: ModuleId.SAMPLING_QUANTIZATION, label: 'Sampling & Quantization', icon: <Activity size={20} /> },
    { id: ModuleId.PCM_DPCM, label: 'PCM vs DPCM', icon: <Scale size={20} /> },
    { id: ModuleId.LINE_CODES, label: 'Line Coding', icon: <Binary size={20} /> },
    { id: ModuleId.DELTA_MODULATION, label: 'Delta Modulation', icon: <TrendingUp size={20} /> },
    { id: ModuleId.ADAPTIVE_DM, label: 'Adaptive DM', icon: <Zap size={20} /> },
    { id: ModuleId.QUIZ, label: 'Knowledge Check', icon: <BrainCircuit size={20} /> },
  ];

  const dmItems = [
    { id: ModuleId.DM_INTRO, label: 'DM Fundamentals', icon: <BookOpen size={20} /> },
    { id: ModuleId.DM_CAPACITY, label: 'Information Capacity', icon: <BarChart size={20} /> },
    { id: ModuleId.DM_TECHNIQUES, label: 'Modulation (ASK, FSK...)', icon: <Radio size={20} /> },
  ];

  const transformItems = [
    { id: ModuleId.TRANSFORMS, label: 'Interactive Visualizer', icon: <Waves size={20} /> },
  ];

  let items = pcmItems;
  let title = "PCM Master";
  let themeColor = "indigo";

  switch (activeDomain) {
    case DomainId.DIGITAL_MODULATION:
      items = dmItems;
      title = "Digital Mod Master";
      themeColor = "emerald";
      break;
    case DomainId.TRANSFORMS:
      items = transformItems;
      title = "Signals & Systems";
      themeColor = "violet";
      break;
    default:
      items = pcmItems;
      title = "PCM Master";
      themeColor = "indigo";
  }

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <button 
            onClick={onSwitchDomain}
            className="flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 mb-3 transition-colors group"
        >
            <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Switch Course
        </button>
        <div key={title} className="animate-fade-in">
          <h1 className={`text-xl font-bold text-${themeColor}-700 transition-colors duration-300`}>{title}</h1>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto" key={activeDomain}>
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            style={{ 
              animation: `slideIn 0.3s ease-out forwards`,
              animationDelay: `${index * 0.05}s`,
              opacity: 0
            }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeModule === item.id
                ? `bg-${themeColor}-50 text-${themeColor}-700 shadow-sm font-medium translate-x-1`
                : `text-slate-600 hover:bg-slate-50 hover:text-${themeColor}-600 hover:translate-x-1`
            }`}
          >
            <span className={`transition-colors duration-200 ${activeModule === item.id ? `text-${themeColor}-600` : 'text-slate-400'}`}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 bg-slate-50 text-xs text-slate-400 text-center border-t border-slate-100">
        v2.2.0 | Educational Use
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
