import React from 'react';
import { Compass, RefreshCcw, Map } from 'lucide-react';
import { UserRole, SupportedLanguage } from '../types';
import { TRANSLATIONS } from '../constants';

interface HeaderProps {
  userRole: UserRole;
  language: SupportedLanguage;
  onReset: () => void;
  onVisualize: () => void;
  isVisualizing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ userRole, language, onReset, onVisualize, isVisualizing }) => {
  const t = TRANSLATIONS[language];
  const roleTitle = t.roles[userRole]?.title || userRole;

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shadow-sm z-20">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Compass size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900 leading-tight">Disha</h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>{roleTitle}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>{language}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={onVisualize}
          disabled={isVisualizing}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          title={t.visualize}
        >
          <Map size={16} />
          {isVisualizing ? t.building : t.visualize}
        </button>
        
        <button 
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          title={t.restart}
        >
          <RefreshCcw size={20} />
        </button>
      </div>
    </header>
  );
};
