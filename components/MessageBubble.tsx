import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Bot, User, Globe } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  sourcesLabel?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, sourcesLabel = 'Sources' }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isUser ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
          }`}>
            {isUser ? (
              <p>{message.text}</p>
            ) : (
              <div className="prose prose-sm md:prose-base max-w-none prose-p:my-1 prose-headings:text-slate-900 prose-headings:font-semibold prose-a:text-indigo-600 prose-strong:text-slate-900 prose-ul:list-disc prose-ul:pl-4">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            )}
          </div>

          {/* Grounding / Citations */}
          {!isUser && message.groundingChunks && message.groundingChunks.length > 0 && (
            <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg w-full max-w-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                <Globe size={12} />
                {sourcesLabel}
              </div>
              <div className="flex flex-wrap gap-2">
                {message.groundingChunks.map((chunk, idx) => (
                  chunk.web?.uri && (
                    <a 
                      key={idx} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs bg-white hover:bg-slate-100 border border-slate-200 text-indigo-600 px-2 py-1 rounded-md transition-colors truncate max-w-[200px]"
                      title={chunk.web.title}
                    >
                      {chunk.web.title || new URL(chunk.web.uri).hostname}
                    </a>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <span className="text-xs text-slate-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
