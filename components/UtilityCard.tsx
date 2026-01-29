
import React from 'react';
import { Utility } from '../types';
import { AI_ICON, ANALYTICS_ICON } from '../constants';
import { ArrowUpRight } from 'lucide-react';

interface UtilityCardProps {
  utility: Utility;
}

const UtilityCard: React.FC<UtilityCardProps> = ({ utility }) => {
  const isAI = utility.type === 'AI';
  const accentColorClass = isAI ? 'border-indigo-100 hover:border-indigo-400' : 'border-teal-100 hover:border-teal-400';
  const iconBgClass = isAI ? 'bg-violet-50' : 'bg-teal-50';
  
  return (
    <a 
      href={utility.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block p-6 bg-white border-2 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${accentColorClass}`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${iconBgClass}`}>
          {isAI ? AI_ICON : ANALYTICS_ICON}
        </div>
        <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 transition-colors" />
      </div>
      <div className="mt-5">
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
          {utility.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          {utility.description}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-md ${isAI ? 'bg-violet-100 text-indigo-700' : 'bg-teal-100 text-teal-700'}`}>
          {utility.type}
        </span>
      </div>
    </a>
  );
};

export default UtilityCard;
