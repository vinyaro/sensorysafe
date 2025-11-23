import React, { useState } from 'react';
import { NoiseLevelStatus, Language } from '../types';
import { generateCalmingAdvice } from '../services/geminiService';
import { translations } from '../utils/translations';
import { Sparkles, MessageCircleHeart, X } from 'lucide-react';

interface CalmAssistantProps {
  decibels: number;
  status: NoiseLevelStatus;
  language: Language;
}

const CalmAssistant: React.FC<CalmAssistantProps> = ({ decibels, status, language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const t = translations[language];

  const handleGetAdvice = async () => {
    setIsLoading(true);
    setAdvice(null);
    setIsOpen(true);
    
    const result = await generateCalmingAdvice(decibels, status, language);
    setAdvice(result);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={handleGetAdvice}
        className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors shadow-lg w-full justify-center sm:w-auto"
      >
        <Sparkles className="w-5 h-5 text-purple-400" />
        <span>{t.overwhelmed}</span>
      </button>
    );
  }

  return (
    <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-xl p-6 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 text-purple-400">
          <MessageCircleHeart className="w-6 h-6" />
          <h3 className="font-semibold text-lg">{t.calmingAssistant}</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="min-h-[100px] flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-slate-400 text-sm animate-pulse">{t.findingCalm}</span>
          </div>
        ) : (
          <p className="text-slate-100 text-lg leading-relaxed text-center font-medium">
            "{advice}"
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <button 
          onClick={handleGetAdvice}
          className="text-sm text-slate-400 hover:text-purple-400 underline decoration-dotted underline-offset-4 transition-colors"
          disabled={isLoading}
        >
          {t.tryAnother}
        </button>
      </div>
    </div>
  );
};

export default CalmAssistant;
