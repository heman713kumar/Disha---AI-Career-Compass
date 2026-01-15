import React from 'react';
import { PathwayData } from '../types';
import { CheckCircle2, Circle, Milestone as MilestoneIcon, ArrowRight } from 'lucide-react';

interface PathwayVisualizerProps {
  data: PathwayData;
  onClose: () => void;
  labels?: {
    recommended: string;
    close: string;
  };
}

export const PathwayVisualizer: React.FC<PathwayVisualizerProps> = ({ data, onClose, labels = { recommended: 'Recommended Pathway', close: 'Close View' } }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <MilestoneIcon size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">{labels.recommended}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{data.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="space-y-8 relative">
            {/* Connecting Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-200 hidden md:block"></div>

            {data.phases.map((phase, phaseIdx) => (
              <div key={phaseIdx} className="relative">
                {/* Phase Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="hidden md:flex h-12 w-12 rounded-full bg-indigo-100 border-4 border-white items-center justify-center text-indigo-700 font-bold z-10 shadow-sm shrink-0">
                    {phaseIdx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 bg-white px-4 py-1 rounded-full shadow-sm border border-slate-200 inline-block">
                    {phase.phaseName}
                  </h3>
                </div>

                {/* Milestones Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:pl-16">
                  {phase.milestones.map((milestone, mIdx) => (
                    <div 
                      key={mIdx} 
                      className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${milestone.type === 'major' ? 'border-l-4 border-l-indigo-500' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${milestone.type === 'major' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          {milestone.type}
                        </span>
                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                          <Circle size={10} className="fill-slate-200 text-slate-200" />
                          {milestone.timeline}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-1">{milestone.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{milestone.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors">
                {labels.close}
            </button>
        </div>
      </div>
    </div>
  );
};
