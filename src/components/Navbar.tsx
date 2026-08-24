import React from 'react';
import { 
  Code2, 
  History, 
  HelpCircle, 
  Database, 
  User as UserIcon, 
  LogOut, 
  Zap, 
  Sparkles,
  BarChart3,
  Terminal,
  Cpu
} from 'lucide-react';
import { User, DbStatus } from '../types';

export type ActiveTab = 'optimizer' | 'comparison' | 'refactor' | 'history' | 'quiz';

interface NavbarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  dbStatus: DbStatus | null;
  historyCount: number;
  activeModelName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onChangeTab,
  user,
  onOpenAuth,
  onLogout,
  dbStatus,
  historyCount,
  activeModelName = 'gemini-3.7-flash',
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-0 z-40 font-mono">
      {/* Top macOS System Menu Bar */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1.5 bg-slate-900/90 border-b border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-xs select-none"></span>
          <span className="font-bold text-white select-none">OptimizerOS</span>
          <button 
            type="button" 
            onClick={() => onChangeTab('optimizer')} 
            className="hover:text-slate-200 transition-colors"
          >
            Terminal
          </button>
          <button 
            type="button" 
            onClick={() => onChangeTab('comparison')} 
            className="hover:text-slate-200 transition-colors"
          >
            Matrix
          </button>
          <button 
            type="button" 
            onClick={() => onChangeTab('refactor')} 
            className="hover:text-slate-200 transition-colors text-cyan-400"
          >
            Refactor
          </button>
          <button 
            type="button" 
            onClick={() => onChangeTab('history')} 
            className="hover:text-slate-200 transition-colors"
          >
            Logs
          </button>
          <button 
            type="button" 
            onClick={() => onChangeTab('quiz')} 
            className="hover:text-slate-200 transition-colors"
          >
            Assessment
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px]" title="Dynamic Gemini Model Resolver with fallback chain">
            <Cpu className="w-3 h-3 text-cyan-400" />
            <span className="text-slate-300">Model:</span>
            <span className="text-cyan-300 font-bold">{activeModelName}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Session Sync</span>
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onChangeTab('optimizer')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                <Terminal className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-tight">Optimizer Terminal</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                    macOS
                  </span>
                </div>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                id="nav-optimizer-tab"
                type="button"
                onClick={() => onChangeTab('optimizer')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'optimizer'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>1. Optimizer</span>
              </button>

              <button
                id="nav-comparison-tab"
                type="button"
                onClick={() => onChangeTab('comparison')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'comparison'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Matrix</span>
              </button>

              <button
                id="nav-refactor-tab"
                type="button"
                onClick={() => onChangeTab('refactor')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'refactor'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. Auto-Refactor</span>
              </button>

              <button
                id="nav-history-tab"
                type="button"
                onClick={() => onChangeTab('history')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>4. History</span>
                {historyCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {historyCount}
                  </span>
                )}
              </button>

              <button
                id="nav-quiz-tab"
                type="button"
                onClick={() => onChangeTab('quiz')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>5. Quiz (10 Qs)</span>
              </button>
            </nav>
          </div>

          {/* Right Status Controls & User Account */}
          <div className="flex items-center gap-2.5">
            {/* System Status Pill */}
            <div 
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">AST Engine:</span>
              <span className="text-emerald-400 font-medium">Ready</span>
            </div>

            {/* User Account Controls */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 pl-2.5 rounded-xl">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  id="user-logout-btn"
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Sign out / Switch account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="open-auth-modal-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Sign In / Connect</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-900 text-xs">
          <button
            onClick={() => onChangeTab('optimizer')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === 'optimizer' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Optimizer</span>
          </button>
          <button
            onClick={() => onChangeTab('comparison')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg font-medium ${
              activeTab === 'comparison' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Matrix</span>
          </button>
          <button
            onClick={() => onChangeTab('refactor')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg font-medium ${
              activeTab === 'refactor' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Refactor</span>
          </button>
          <button
            onClick={() => onChangeTab('history')}
            className={`flex items-center gap-1 py-1 px-2 rounded-lg font-medium ${
              activeTab === 'history' ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-400'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>
          <button
            onClick={() => onChangeTab('quiz')}
            className={`flex items-center gap-1 py-1 px-2.5 rounded-lg font-medium ${
              activeTab === 'quiz' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz</span>
          </button>
        </div>
      </div>
    </header>
  );
};
