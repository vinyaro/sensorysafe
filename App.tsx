import React, { useState } from 'react';
import { useAudioAnalyzer } from './hooks/useAudioAnalyzer';
import DecibelMeter from './components/DecibelMeter';
import Visualizer from './components/Visualizer';
import CalmAssistant from './components/CalmAssistant';
import { Mic, MicOff, Info, Languages } from 'lucide-react';
import { Language } from './types';
import { translations } from './utils/translations';

const App: React.FC = () => {
  const { isListening, decibels, status, frequencyData, startListening, stopListening } = useAudioAnalyzer();
  const [language, setLanguage] = useState<Language>('en');
  
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'pt' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden">
      {/* Background ambient glow based on status */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000
          ${status === 'Safe' ? 'bg-teal-900' : status === 'Caution' ? 'bg-yellow-900' : 'bg-red-900'}
        `}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex justify-between items-center border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">{t.appName}</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold tracking-wide transition-colors text-slate-300"
            aria-label="Toggle Language"
          >
            <Languages className="w-4 h-4" />
            {language === 'en' ? 'PT' : 'EN'}
          </button>

          <div className="group relative">
             <Info className="w-5 h-5 text-slate-500 hover:text-slate-300 cursor-help" />
             <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
               {t.description}
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center max-w-3xl mx-auto w-full px-4 py-8 gap-8">
        
        {/* Top Controls */}
        <div className="w-full flex justify-center">
          {!isListening ? (
            <button 
              onClick={startListening}
              className="flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 font-semibold text-lg"
            >
              <Mic className="w-6 h-6" />
              {t.start}
            </button>
          ) : (
            <button 
              onClick={stopListening}
              className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700 transition-all text-sm"
            >
              <MicOff className="w-4 h-4" />
              {t.stop}
            </button>
          )}
        </div>

        {/* Core Display */}
        <div className={`transition-opacity duration-500 w-full flex flex-col items-center gap-8 ${isListening ? 'opacity-100' : 'opacity-50 grayscale'}`}>
          
          <DecibelMeter decibels={decibels} status={status} language={language} />
          
          <div className="w-full max-w-xl">
            <Visualizer frequencyData={frequencyData} status={status} />
          </div>

          {isListening && (
            <div className="w-full flex justify-center mt-4">
              <CalmAssistant decibels={decibels} status={status} language={language} />
            </div>
          )}

        </div>

        {!isListening && (
          <div className="text-center mt-12 max-w-md text-slate-500">
            <p>{t.idleMessage}</p>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-slate-600 text-sm">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
};

export default App;
