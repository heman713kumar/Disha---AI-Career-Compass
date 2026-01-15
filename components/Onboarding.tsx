import React, { useState } from 'react';
import { USER_ROLES_METADATA, LANGUAGES_CONFIG, TRANSLATIONS } from '../constants';
import { UserRole, SupportedLanguage } from '../types';
import { GraduationCap, Briefcase, Users, ChevronRight, Languages } from 'lucide-react';

interface OnboardingProps {
  onComplete: (role: UserRole, language: SupportedLanguage) => void;
}

const IconMap: Record<string, React.FC<any>> = {
  GraduationCap,
  Briefcase,
  Users
};

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'language' | 'role'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage | null>(null);

  const handleLanguageSelect = (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setStep('role');
  };

  const handleRoleSelect = (role: UserRole) => {
    if (selectedLanguage) {
      onComplete(role, selectedLanguage);
    }
  };

  const t = selectedLanguage ? TRANSLATIONS[selectedLanguage] : TRANSLATIONS[SupportedLanguage.ENGLISH];

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 max-w-5xl mx-auto animate-in fade-in zoom-in duration-300">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          {step === 'language' ? 'Welcome to ' : t.welcome + ' '}<span className="text-indigo-600">Disha</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {step === 'language' 
            ? "Your personal AI career compass. First, choose your preferred language."
            : t.subtitleRole}
        </p>
      </div>

      {step === 'language' ? (
         <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
          {LANGUAGES_CONFIG.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleLanguageSelect(lang.id)}
              className="group flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
            >
              <div className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-indigo-700">
                {lang.native}
              </div>
              <div className="text-sm text-slate-500 group-hover:text-indigo-600">
                {lang.label}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {USER_ROLES_METADATA.map((role) => {
            const Icon = IconMap[role.icon];
            const roleData = t.roles[role.id];
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="group relative flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-6">
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700">
                  {roleData.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  {roleData.description}
                </p>
                <div className="mt-auto opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-indigo-600 font-medium flex items-center gap-1">
                  {t.startJourney} <ChevronRight size={16} />
                </div>
              </button>
            );
          })}
        </div>
      )}
      
      <div className="mt-12 flex flex-col items-center gap-2">
        {step === 'role' && (
          <button 
            onClick={() => setStep('language')}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-2"
          >
            ← {t.changeLanguage} ({selectedLanguage})
          </button>
        )}
        <p className="text-xs text-slate-400 text-center">
          {t.poweredBy}
        </p>
      </div>
    </div>
  );
};
