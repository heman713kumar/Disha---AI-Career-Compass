import React, { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { ChatInterface } from './components/ChatInterface';
import { UserRole, SupportedLanguage } from './types';
import { initializeGemini } from './services/geminiService';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [language, setLanguage] = useState<SupportedLanguage | null>(null);

  const handleOnboardingComplete = (role: UserRole, lang: SupportedLanguage) => {
    initializeGemini(role, lang);
    setUserRole(role);
    setLanguage(lang);
  };

  const handleReset = () => {
    setUserRole(null);
    setLanguage(null);
    // Force reload to clear Gemini session state since it's a module level variable in service
    window.location.reload();
  };

  return (
    <div className="h-full w-full">
      {!userRole || !language ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <ChatInterface userRole={userRole} language={language} onReset={handleReset} />
      )}
    </div>
  );
};

export default App;
