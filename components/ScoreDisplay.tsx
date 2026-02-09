import React from 'react';
import { ScoreResult } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Props {
  result: ScoreResult;
  currentPrice: string;
  symbol: string;
}

export const ScoreDisplay: React.FC<Props> = ({ result, currentPrice, symbol }) => {
  const getScoreColor = (score: number) => {
    if (score > 7) return 'text-emerald-400 border-emerald-500 shadow-emerald-900/50';
    if (score >= 5) return 'text-yellow-400 border-yellow-500 shadow-yellow-900/50';
    return 'text-rose-400 border-rose-500 shadow-rose-900/50';
  };

  const getActionColor = (score: number) => {
    if (score > 7) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (score >= 5) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  return (
    <div className="w-full bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <TrendingUp size={120} />
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Symbol & Price Info */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
            {symbol.toUpperCase()}
          </h1>
          <div className="flex items-center gap-2 justify-center md:justify-start text-slate-400">
            <span className="text-sm font-semibold uppercase tracking-wider">Current Price</span>
          </div>
          <p className="text-2xl font-mono text-emerald-400 mt-1">{currentPrice}</p>
        </div>

        {/* Big Score Circle */}
        <div className="flex flex-col items-center">
            <div className={`
                w-32 h-32 md:w-40 md:h-40 rounded-full border-8 flex items-center justify-center 
                shadow-[0_0_30px_rgba(0,0,0,0.3)] bg-slate-900/80 backdrop-blur-sm
                transition-all duration-700 ease-out transform hover:scale-105
                ${getScoreColor(result.totalScore)}
            `}>
                <span className="text-5xl md:text-6xl font-bold tracking-tighter">
                    {result.totalScore}
                </span>
            </div>
            <span className="mt-3 text-slate-500 text-xs uppercase tracking-widest font-semibold">Total Score</span>
        </div>

        {/* Rating & Action */}
        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
           <div className={`p-4 rounded-xl border ${getActionColor(result.totalScore)} text-center`}>
              <div className="text-xs uppercase tracking-wider opacity-80 mb-1">Rating</div>
              <div className="text-lg font-bold">{result.rating.split('(')[0].trim()}</div>
           </div>
           
           <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 text-center">
             <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">Recommended Action</div>
             <div className="text-lg font-bold text-slate-200">{result.action}</div>
           </div>
        </div>

      </div>
    </div>
  );
};
