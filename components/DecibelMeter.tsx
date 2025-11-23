import React from 'react';
import { NoiseLevelStatus, Language } from '../types';
import { translations } from '../utils/translations';

interface DecibelMeterProps {
  decibels: number;
  status: NoiseLevelStatus;
  language: Language;
}

const DecibelMeter: React.FC<DecibelMeterProps> = ({ decibels, status, language }) => {
  const t = translations[language];
  
  const getStatusColor = (s: NoiseLevelStatus) => {
    switch (s) {
      case NoiseLevelStatus.Safe: return 'bg-teal-500 shadow-teal-500/50';
      case NoiseLevelStatus.Caution: return 'bg-yellow-500 shadow-yellow-500/50';
      case NoiseLevelStatus.Danger: return 'bg-rose-500 shadow-rose-500/50';
    }
  };

  const getStatusText = (s: NoiseLevelStatus) => {
    switch (s) {
      case NoiseLevelStatus.Safe: return t.comfortable;
      case NoiseLevelStatus.Caution: return t.moderate;
      case NoiseLevelStatus.Danger: return t.loud;
    }
  };

  const getBgColor = (s: NoiseLevelStatus) => {
    switch (s) {
      case NoiseLevelStatus.Safe: return 'border-teal-500/30 bg-teal-500/10 text-teal-200';
      case NoiseLevelStatus.Caution: return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-200';
      case NoiseLevelStatus.Danger: return 'border-rose-500/30 bg-rose-500/10 text-rose-200';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Pulsing outer ring */}
        <div className={`absolute inset-0 rounded-full opacity-20 animate-pulse ${getStatusColor(status).split(' ')[0]}`}></div>
        
        {/* Main Circle */}
        <div className={`w-56 h-56 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-500 ${getBgColor(status)} shadow-2xl`}>
          <span className="text-6xl font-bold tabular-nums tracking-tighter">
            {decibels}
          </span>
          <span className="text-sm opacity-70 font-medium mt-2">{t.dbSpl}</span>
        </div>
      </div>

      <div className={`mt-6 px-6 py-2 rounded-full border transition-colors duration-500 ${getBgColor(status)}`}>
        <h2 className="text-xl font-semibold">{getStatusText(status)}</h2>
      </div>
    </div>
  );
};

export default DecibelMeter;
