import React, { useState, useEffect } from 'react';
import { Search, LineChart, AlertTriangle, Info, Terminal, Share2, Save, Trash2, History } from 'lucide-react';
import { analyzeStock } from './services/geminiService';
import { calculateScore } from './utils/scoring';
import { StockData, ScoreResult, SavedAnalysis } from './types';
import { ScoreDisplay } from './components/ScoreDisplay';
import { CriteriaCard } from './components/CriteriaCard';
import { StockChart } from './components/StockChart';

export default function App() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StockData | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gemini_pro_saved_analyses');
    if (saved) {
      try {
        setSavedAnalyses(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved analyses", e);
      }
    }
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);
    setResult(null);
    setShowSaved(false);

    try {
      const stockData = await analyzeStock(symbol.trim());
      const scoreResult = calculateScore(stockData);
      
      setData(stockData);
      setResult(scoreResult);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while analyzing the stock.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!data || !result) return;
    
    const newSave: SavedAnalysis = {
      id: Date.now().toString(),
      symbol: data.symbol,
      date: new Date().toLocaleDateString(),
      result: result,
      data: data
    };

    const updated = [newSave, ...savedAnalyses];
    setSavedAnalyses(updated);
    localStorage.setItem('gemini_pro_saved_analyses', JSON.stringify(updated));
    alert('Analysis saved successfully!');
  };

  const handleShare = async () => {
    if (!data || !result) return;

    const shareText = `📊 Gemini Financial Analyst Pro Report for ${data.symbol.toUpperCase()}
⭐ Score: ${result.totalScore}/10 (${result.rating})
💰 Price: ${data.current_price}
🎯 Action: ${result.action}

Check full analysis on the app!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Analysis for ${data.symbol}`,
          text: shareText,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Analysis summary copied to clipboard!');
    }
  };

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedAnalyses.filter(item => item.id !== id);
    setSavedAnalyses(updated);
    localStorage.setItem('gemini_pro_saved_analyses', JSON.stringify(updated));
  };

  const loadSavedAnalysis = (saved: SavedAnalysis) => {
    setData(saved.data);
    setResult(saved.result);
    setSymbol(saved.symbol);
    setShowSaved(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 font-sans pb-12">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setData(null); setResult(null); }}>
            <div className="bg-emerald-500/20 p-2 rounded-lg">
                <LineChart className="text-emerald-500 w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 hidden sm:inline">
              Gemini Financial Analyst Pro
            </span>
             <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 sm:hidden">
              Gemini Pro
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setShowSaved(!showSaved)}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
             >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Saved Reports</span>
                <span className="bg-slate-800 text-xs px-2 py-0.5 rounded-full">{savedAnalyses.length}</span>
             </button>
             <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-mono border-l border-slate-800 pl-4">
                <Terminal className="w-4 h-4" />
                <span>v4.1.0</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        
        {/* Saved Analyses Dropdown/Drawer Area */}
        {showSaved && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 animate-in slide-in-from-top-4">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-emerald-500" />
                    Saved Analyses
                </h3>
                {savedAnalyses.length === 0 ? (
                    <p className="text-slate-500 text-sm">No saved reports yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {savedAnalyses.map((saved) => (
                            <div 
                                key={saved.id}
                                onClick={() => loadSavedAnalysis(saved)}
                                className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:scale-[1.02] group relative"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <div className="font-bold text-lg text-white">{saved.symbol}</div>
                                        <div className="text-xs text-slate-500">{saved.date}</div>
                                    </div>
                                    <div className={`text-xl font-bold ${saved.result.totalScore > 7 ? 'text-emerald-400' : saved.result.totalScore >= 5 ? 'text-yellow-400' : 'text-rose-400'}`}>
                                        {saved.result.totalScore}
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 truncate">{saved.result.rating}</div>
                                
                                <button 
                                    onClick={(e) => handleDeleteSaved(saved.id, e)}
                                    className="absolute top-2 right-2 p-1.5 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* Input Section */}
        {!data && !loading && !showSaved && (
             <div className="flex flex-col items-center justify-center space-y-6 max-w-2xl mx-auto py-12">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Stock Analysis Engine</h2>
                    <p className="text-slate-400 text-lg">Enter a stock symbol to generate a professional CFA-grade analysis report.</p>
                </div>
             </div>
        )}

        <div className={`max-w-2xl mx-auto transition-all duration-500 ${data ? 'mb-8' : ''}`}>
             <form onSubmit={handleAnalyze} className="w-full relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex gap-2 p-2 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-4 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 focus:outline-none text-lg font-mono uppercase"
                            placeholder="e.g. HPG, VCB, FPT..."
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !symbol}
                        className={`
                            px-6 sm:px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 whitespace-nowrap
                            ${loading 
                                ? 'bg-slate-700 cursor-not-allowed opacity-70' 
                                : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/80 active:scale-95'
                            }
                        `}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                <span className="hidden sm:inline">Analyzing...</span>
                            </div>
                        ) : (
                            'Analyze'
                        )}
                    </button>
                </div>
            </form>
        </div>

        {/* Error Message */}
        {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-top-2">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
            </div>
        )}

        {/* Results Section */}
        {data && result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                
                {/* Action Toolbar */}
                <div className="flex justify-end gap-3">
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all hover:border-emerald-500/50"
                    >
                        <Save className="w-4 h-4" />
                        Save Report
                    </button>
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-600/20 transition-all"
                    >
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>

                <ScoreDisplay 
                    result={result} 
                    currentPrice={data.current_price} 
                    symbol={data.symbol} 
                />

                {data.historical_data && data.historical_data.length > 0 && (
                  <StockChart data={data.historical_data} symbol={data.symbol} />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CriteriaCard 
                        title="Fundamental Analysis (FA)" 
                        score={result.faScore} 
                        maxScore={4}
                        colorClass="text-blue-400"
                        items={[
                            { label: "YoY Rev/Profit Growth > 0", data: data.criteria.rev_growth_pos },
                            { label: "Attractive Valuation (P/E, P/B)", data: data.criteria.val_attractive },
                            { label: "Financial Health (Debt/Cash)", data: data.criteria.health_safe },
                            { label: "Clear Growth Story", data: data.criteria.story_clear },
                        ]}
                    />

                    <CriteriaCard 
                        title="Technical Analysis (TA)" 
                        score={result.taScore} 
                        maxScore={4}
                        colorClass="text-purple-400"
                        items={[
                            { label: "Main Trend UP (+1.5)", data: data.criteria.trend_up },
                            { label: "Price > MA20 & MA50 (+1.0)", data: data.criteria.price_abv_ma },
                            { label: "Volume Support (+1.0)", data: data.criteria.vol_support },
                            { label: "Positive RSI/MACD (+0.5)", data: data.criteria.indicators_good },
                        ]}
                    />

                    <div className="grid grid-cols-1 gap-6 content-start">
                        <CriteriaCard 
                            title="Momentum" 
                            score={result.momScore} 
                            maxScore={2}
                            colorClass="text-orange-400"
                            items={[
                                { label: "Supportive Macro/News", data: data.criteria.news_support },
                                { label: "Foreign/Prop Trading Net Buy", data: data.criteria.foreign_buy },
                            ]}
                        />

                        {result.reasons.length > 0 && (
                             <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-6">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    Key Issues (Points Deducted)
                                </h3>
                                <ul className="space-y-2">
                                    {result.reasons.map((reason, idx) => (
                                        <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                                            <span className="text-slate-600 mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0"></span>
                                            {reason}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900/80 rounded-lg p-4 flex items-start gap-3 border border-slate-800">
                    <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                        <strong>Disclaimer:</strong> This report is generated by AI (Gemini) based on public information found via Google Search. It is for informational purposes only and does not constitute financial advice. The scoring logic follows a strict pre-defined algorithm. Always verify data from official sources before trading.
                    </p>
                </div>
            </div>
        )}

      </main>
    </div>
  );
}
