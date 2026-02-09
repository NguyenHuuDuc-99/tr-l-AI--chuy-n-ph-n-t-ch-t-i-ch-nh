import React from 'react';
import { StockCriteria } from '../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  title: string;
  score: number;
  maxScore: number;
  items: { label: string; data: StockCriteria }[];
  colorClass: string;
}

export const CriteriaCard: React.FC<Props> = ({ title, score, maxScore, items, colorClass }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
        <h3 className={`text-lg font-bold ${colorClass}`}>{title}</h3>
        <span className="text-xl font-mono font-bold bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
          {score}/{maxScore}
        </span>
      </div>
      <div className="space-y-4 flex-grow">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="mt-0.5 flex-shrink-0">
              {item.data.value ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-500" />
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${item.data.value ? 'text-slate-200' : 'text-slate-400'}`}>
                {item.label}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                {item.data.reason}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
