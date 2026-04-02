
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ModuleId, DomainId } from './types';
import Sidebar from './components/Sidebar';
import GlobalIntro from './components/GlobalIntro';

// PCM Components
import Introduction from './components/modules/Introduction';
import Transforms from './components/modules/Transforms';
import SamplingQuantization from './components/modules/SamplingQuantization';
import LineCodes from './components/modules/LineCodes';
import DeltaModulation from './components/modules/DeltaModulation';
import Quiz from './components/modules/Quiz';
import PcmDpcm from './components/modules/PcmDpcm';
import AdaptiveDeltaModulation from './components/modules/AdaptiveDeltaModulation';

// Digital Modulation Components
import DmIntroduction from './components/modules/dm/DmIntroduction';
import InformationCapacity from './components/modules/dm/InformationCapacity';
import DigitalModulationTechniques from './components/modules/dm/DigitalModulationTechniques';

const App: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<DomainId>(DomainId.HOME);
  const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.INTRODUCTION);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDomainSelect = (domain: DomainId) => {
    setActiveDomain(domain);
    // Reset to the default module for each domain
    if (domain === DomainId.PCM) {
      setActiveModule(ModuleId.INTRODUCTION);
    } else if (domain === DomainId.DIGITAL_MODULATION) {
      setActiveModule(ModuleId.DM_INTRO);
    } else if (domain === DomainId.TRANSFORMS) {
      setActiveModule(ModuleId.TRANSFORMS);
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      // PCM Modules
      case ModuleId.INTRODUCTION:
        return <Introduction onNext={() => setActiveModule(ModuleId.SAMPLING_QUANTIZATION)} />;
      case ModuleId.TRANSFORMS:
        return <Transforms />;
      case ModuleId.SAMPLING_QUANTIZATION:
        return <SamplingQuantization />;
      case ModuleId.PCM_DPCM:
        return <PcmDpcm />;
      case ModuleId.LINE_CODES:
        return <LineCodes />;
      case ModuleId.DELTA_MODULATION:
        return <DeltaModulation />;
      case ModuleId.ADAPTIVE_DM:
        return <AdaptiveDeltaModulation />;
      case ModuleId.QUIZ:
        return <Quiz />;

      // DM Modules
      case ModuleId.DM_INTRO:
        return <DmIntroduction />;
      case ModuleId.DM_CAPACITY:
        return <InformationCapacity />;
      case ModuleId.DM_TECHNIQUES:
        return <DigitalModulationTechniques />;
        
      default:
        return <div className="p-8 text-center text-slate-500">Module under construction</div>;
    }
  };

  if (activeDomain === DomainId.HOME) {
    return <GlobalIntro onSelectDomain={handleDomainSelect} />;
  }

  let domainTitle = 'PCM System';
  if (activeDomain === DomainId.DIGITAL_MODULATION) domainTitle = 'Digital Modulation';
  if (activeDomain === DomainId.TRANSFORMS) domainTitle = 'Signals & Systems';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-50">
        <h1 className="font-bold text-lg text-indigo-600">
            {domainTitle}
        </h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
          activeModule={activeModule} 
          setActiveModule={(m) => {
            setActiveModule(m);
            setIsSidebarOpen(false);
          }} 
          activeDomain={activeDomain}
          onSwitchDomain={() => setActiveDomain(DomainId.HOME)}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 scroll-smooth">
        <div className="max-w-6xl mx-auto p-6 md:p-12">
          {renderModule()}
        </div>
      </main>
    </div>
  );
};

export default App;
