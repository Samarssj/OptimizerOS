import React from 'react';
import { Sparkles, History, Code2, Zap, FileCode2 } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
  onNewOptimization: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  historyCount,
  onNewOptimization,
  hasResult,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Code Optimizer</h1>
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Deep performance analysis, Big-O breakdown & clean code transformation
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {hasResult && (
            <button
              id="new-optimization-btn"
              onClick={onNewOptimization}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-colors shadow-sm"
              title="Start a new optimization"
            >
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              <span>New Input</span>
            </button>
          )}

          <button
            id="history-drawer-btn"
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 transition-colors relative"
            title="View optimization history"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
