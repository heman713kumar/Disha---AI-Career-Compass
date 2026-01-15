import React, { useState, useRef, useEffect } from 'react';
import { Send, Map, Loader2 } from 'lucide-react';
import { Message, UserRole, PathwayData, SupportedLanguage } from '../types';
import { sendMessageStream, generateJsonForVisualization } from '../services/geminiService';
import { MessageBubble } from './MessageBubble';
import { Header } from './Header';
import { PathwayVisualizer } from './PathwayVisualizer';
import { VISUALIZATION_PROMPT, TRANSLATIONS } from '../constants';

interface ChatInterfaceProps {
  userRole: UserRole;
  language: SupportedLanguage;
  onReset: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userRole, language, onReset }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [pathwayData, setPathwayData] = useState<PathwayData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const t = TRANSLATIONS[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial Greeting
  useEffect(() => {
    const startConversation = async () => {
      setIsLoading(true);
      try {
        const initialPrompt = `Hello! I am ready to start my career guidance journey. Please greet me in ${language}.`;
        const responseGenerator = sendMessageStream(initialPrompt);
        
        let fullText = "";
        let groundingChunks: any[] = [];
        const botMsgId = Date.now().toString();
        
        setMessages([{
            id: botMsgId,
            role: 'model',
            text: '',
            timestamp: new Date()
        }]);

        for await (const chunk of responseGenerator) {
            const text = chunk.text || "";
            fullText += text;
            if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                groundingChunks = [...groundingChunks, ...chunk.candidates[0].groundingMetadata.groundingChunks];
            }
            
            setMessages(prev => prev.map(msg => 
                msg.id === botMsgId 
                ? { ...msg, text: fullText, groundingChunks } 
                : msg
            ));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
        const botMsgId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: botMsgId,
            role: 'model',
            text: '',
            timestamp: new Date()
        }]);

        const responseGenerator = sendMessageStream(userMsg.text);
        let fullText = "";
        let groundingChunks: any[] = [];

        for await (const chunk of responseGenerator) {
            const text = chunk.text || "";
            fullText += text;
            
            if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                // Deduplicate chunks roughly by uri
                const newChunks = chunk.candidates[0].groundingMetadata.groundingChunks;
                groundingChunks = [...groundingChunks, ...newChunks];
            }

            setMessages(prev => prev.map(msg => 
                msg.id === botMsgId 
                ? { ...msg, text: fullText, groundingChunks } 
                : msg
            ));
        }
    } catch (error) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: "I'm having trouble connecting right now. Please check your internet or try again.",
            timestamp: new Date(),
            isError: true
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVisualize = async () => {
    setIsVisualizing(true);
    try {
        const jsonStr = await generateJsonForVisualization(VISUALIZATION_PROMPT);
        // Clean markdown code blocks if present
        const cleanedJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanedJson);
        setPathwayData(data);
    } catch (e) {
        console.error("Failed to visualize:", e);
        // Optionally show a toast error
        alert("Could not generate visualization from current context. Please discuss a pathway first.");
    } finally {
        setIsVisualizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      <Header 
        userRole={userRole} 
        language={language}
        onReset={onReset} 
        onVisualize={handleVisualize} 
        isVisualizing={isVisualizing} 
      />

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 md:py-8 scroll-smooth">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} sourcesLabel={t.sources} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm ml-12 animate-pulse">
              <Loader2 className="animate-spin" size={16} />
              <span>{t.thinking}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4 md:p-6">
        <div className="max-w-3xl mx-auto relative flex items-end gap-2">
            {/* Mobile Visualize Button */}
            <button 
                onClick={handleVisualize}
                disabled={isVisualizing}
                className="md:hidden p-3 bg-emerald-50 text-emerald-600 rounded-xl disabled:opacity-50"
            >
                <Map size={24} />
            </button>

            <div className="relative flex-1">
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t.inputPlaceholder}
                    className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-4 pr-12 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none max-h-32 min-h-[50px]"
                    rows={1}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
            {t.disclaimer}
        </p>
      </div>

      {/* Visualization Modal */}
      {pathwayData && (
        <PathwayVisualizer data={pathwayData} onClose={() => setPathwayData(null)} labels={{ recommended: t.recommendedPathway, close: t.closeView }} />
      )}
    </div>
  );
};
