import React, { useState, useEffect, useRef } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { CodeInput } from './components/CodeInput';
import { OptimizationSummary } from './components/OptimizationSummary';
import { DiffViewer } from './components/DiffViewer';
import { ExplanationList } from './components/ExplanationList';
import { TestingTips } from './components/TestingTips';
import { BenchmarkRunner } from './components/BenchmarkRunner';
import { BenchmarkComparisonChart } from './components/BenchmarkComparisonChart';
import { HistoryView } from './components/HistoryView';
import { QuizView } from './components/QuizView';
import { AutoRefactorStudio } from './components/AutoRefactorStudio';
import { AuthModal } from './components/AuthModal';
import { MacAuthGateway } from './components/MacAuthGateway';
import { OptimizationFocus, OptimizationResult, User, DbStatus, ModelStatus, RefactorPatternType } from './types';
import { SAMPLE_CODES } from './data/samples';
import { getSafeAuthHeaders, getSafeToken, storeAuthSession, clearAuthSession, getSafeStoredUser } from './utils/authUtils';
import { AlertCircle, RefreshCw, Zap, Code2, Sparkles, Terminal, BarChart3, Sliders, CheckCircle2 } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'code_optimizer_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('optimizer');
  const [code, setCode] = useState<string>(SAMPLE_CODES[0].code);
  const [language, setLanguage] = useState<string>(SAMPLE_CODES[0].language);
  const [focus, setFocus] = useState<OptimizationFocus>('algorithmic');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  
  // History & Database states
  const [history, setHistory] = useState<OptimizationResult[]>([]);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus | null>(null);
  const [selectedRefactorPattern, setSelectedRefactorPattern] = useState<RefactorPatternType>('loops-to-functional');

  // Auth states (Account creation required before using app)
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInitialAuthChecked, setIsInitialAuthChecked] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize DB status, Model status and Auth on mount
  useEffect(() => {
    fetchDbStatus();
    fetchModelStatus();

    // Check saved user session
    try {
      const savedToken = getSafeToken();
      const savedUser = getSafeStoredUser();
      if (savedToken && savedUser) {
        setAuthToken(savedToken);
        // Do not trust the cached profile until the server verifies the token
        // and account against the configured persistence layer.
        verifyUserSession(savedToken);
      }
    } catch (e) {
      console.warn('Failed to load user session', e);
    } finally {
      setIsInitialAuthChecked(true);
    }

    // Load initial history
    fetchHistory();
  }, []);

  const fetchModelStatus = async () => {
    try {
      const res = await fetch('/api/models/status');
      if (res.ok) {
        const data = await res.json();
        setModelStatus(data);
      }
    } catch (e) {
      console.warn('Failed to fetch model status', e);
    }
  };

  const fetchDbStatus = async () => {
    try {
      const res = await fetch('/api/db/status');
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.warn('Failed to fetch DB status', e);
    }
  };

  const verifyUserSession = async (token: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: getSafeAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token expired
        handleLogout();
      }
    } catch (e) {
      console.warn('Session verification failed; clearing cached session', e);
      // Fail closed: a cached localStorage token must not keep the app
      // apparently authenticated when the server cannot verify its account.
      handleLogout();
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history', {
        headers: getSafeAuthHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.history && data.history.length > 0) {
          setHistory(data.history);
          return;
        }
      }

      // Fallback to localStorage if server returns empty
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        setHistory(JSON.parse(local));
      }
    } catch (e) {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        setHistory(JSON.parse(local));
      }
    }
  };

  const handleAuthSuccess = (authUser: User, token: string) => {
    setUser(authUser);
    setAuthToken(token);
    storeAuthSession(token, authUser);
    fetchHistory();
    fetchDbStatus();
  };

  const handleLogout = () => {
    setUser(null);
    setAuthToken(null);
    clearAuthSession();
    fetchHistory();
  };

  const handleSaveToHistory = async (newResult: OptimizationResult) => {
    const updated = [newResult, ...history.filter((h) => h.id !== newResult.id)].slice(0, 30);
    setHistory(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage save failed', e);
    }

    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: getSafeAuthHeaders(),
        body: JSON.stringify(newResult),
      });
    } catch (e) {
      console.warn('Failed to sync history item to server', e);
    }
  };

  const handleClearHistory = async () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      await fetch('/api/history', {
        method: 'DELETE',
        headers: getSafeAuthHeaders(),
      });
    } catch (e) {
      console.warn('Failed to clear history on server', e);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: getSafeAuthHeaders(),
      });
    } catch (e) {
      console.warn('Failed to delete history item on server', e);
    }
  };

  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_CODES.find((s) => s.id === sampleId);
    if (sample) {
      setCode(sample.code);
      setLanguage(sample.language);
      setFocus(sample.focus);
      setError(null);
    }
  };

  const handleOptimize = async () => {
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: getSafeAuthHeaders(),
        body: JSON.stringify({
          code,
          language: language === 'Auto Detect' ? undefined : language,
          focus,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const optimizationResult: OptimizationResult = {
        id: data.id || 'opt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId: user ? user.id : 'anonymous_guest',
        timestamp: data.timestamp || Date.now(),
        language: data.language || language,
        originalCode: code,
        focus,
        summary: data.summary,
        metrics: data.metrics,
        explanations: data.explanations || [],
        optimizedCode: data.optimizedCode || '',
        keyHighlights: data.keyHighlights || [],
        benchmarksAndTestingTips: data.benchmarksAndTestingTips || [],
        tradeoffsOrCaveats: data.tradeoffsOrCaveats || [],
        savedToDb: data.savedToDb ?? dbStatus?.connected,
      };

      setResult(optimizationResult);
      handleSaveToHistory(optimizationResult);

      // Smooth scroll to results
      setTimeout(() => {
        try {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch {
          // Ignore scrollIntoView browser compatibility errors
        }
      }, 100);
    } catch (err: any) {
      console.error('Optimization error:', err);
      setError(err.message || 'Failed to optimize code. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: OptimizationResult) => {
    setCode(item.originalCode);
    setLanguage(item.language);
    setFocus(item.focus);
    setResult(item);
    setActiveTab('optimizer');
    setError(null);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // MANDATORY ACCOUNT CREATION GATE:
  // If user is not authenticated, render the macOS Terminal Authentication Gateway
  if (!user && isInitialAuthChecked) {
    return (
      <MacAuthGateway
        onAuthSuccess={handleAuthSuccess}
        dbStatus={dbStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-mono selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* macOS Terminal Navigation & Brand Header */}
      <Navbar
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        dbStatus={dbStatus}
        historyCount={history.length}
        activeModelName={modelStatus?.activeModel}
      />

      {/* Main macOS App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. OPTIMIZER TAB */}
        {activeTab === 'optimizer' && (
          <div className="space-y-6">
            {/* macOS Terminal Subhead Banner */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                    <span>optimizer_session.sh</span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-800 px-1.5 py-0.2 rounded">
                      Low-Latency Engine Active
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    AST compilation analysis, memory reduction & algorithmic complexity speedups
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRefactorPattern('loops-to-functional');
                    setActiveTab('refactor');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Auto-Refactor Patterns</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('comparison')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View All 6 Focuses Matrix</span>
                </button>
              </div>
            </div>

            {/* Code Input Studio */}
            <section>
              <CodeInput
                code={code}
                onChangeCode={setCode}
                language={language}
                onChangeLanguage={setLanguage}
                focus={focus}
                onChangeFocus={setFocus}
                onOptimize={handleOptimize}
                isLoading={isLoading}
                onSelectSample={handleSelectSample}
              />
            </section>

            {/* Error Notification */}
            {error && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <strong className="font-semibold block text-rose-300">[COMPILATION_ERROR]</strong>
                  <p className="mt-0.5 text-rose-200">{error}</p>
                </div>
                <button
                  onClick={handleOptimize}
                  className="flex items-center gap-1 px-3 py-1 bg-rose-900/60 hover:bg-rose-800/80 text-rose-100 rounded-lg text-xs font-medium transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              </div>
            )}

            {/* Results Presentation Area */}
            {result && (
              <div ref={resultsRef} className="space-y-6 pt-2">
                {/* Results Section Header */}
                <div className="flex items-center gap-3">
                  <div className="h-px bg-slate-800 flex-1" />
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" />
                    Optimization AST & Metrics Output
                  </span>
                  <div className="h-px bg-slate-800 flex-1" />
                </div>

                {/* 1. Summary & Metric Wins */}
                <OptimizationSummary
                  summary={result.summary}
                  metrics={result.metrics}
                  language={result.language}
                  focus={result.focus}
                  result={result}
                  onNavigateToRefactor={(pattern) => {
                    if (pattern) setSelectedRefactorPattern(pattern as RefactorPatternType);
                    setActiveTab('refactor');
                  }}
                />

                {/* 2. Side-by-Side & Unified Diff Viewer */}
                <DiffViewer
                  originalCode={result.originalCode}
                  optimizedCode={result.optimizedCode}
                  language={result.language}
                  result={result}
                />

                {/* 3. FOCUS BENCHMARK COMPARISON BAR CHART EMBEDDED */}
                <BenchmarkComparisonChart
                  currentCode={code}
                  language={language}
                  selectedFocus={focus}
                  onApplyFocus={(newFocus) => {
                    setFocus(newFocus);
                    handleOptimize();
                  }}
                  token={authToken}
                />

                {/* 4. Detailed Explanations Breakdown */}
                <ExplanationList explanations={result.explanations} />

                {/* 5. Live Sandbox Benchmark Runner */}
                <BenchmarkRunner
                  language={result.language}
                  originalCode={result.originalCode}
                  optimizedCode={result.optimizedCode}
                />

                {/* 6. Key Highlights, Benchmarking Tips & Trade-offs */}
                <TestingTips result={result} />
              </div>
            )}
          </div>
        )}

        {/* 2. FOCUS BENCHMARK COMPARISON MATRIX TAB */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>6-Focus Architectural Benchmark Matrix</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Direct side-by-side bar chart comparison across Speed, Memory, Readability, Big-O, Concurrency, and Balanced strategies.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('optimizer')}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Return to Editor</span>
              </button>
            </div>

            <BenchmarkComparisonChart
              currentCode={code}
              language={language}
              selectedFocus={focus}
              onApplyFocus={(newFocus) => {
                setFocus(newFocus);
                setActiveTab('optimizer');
                handleOptimize();
              }}
              token={authToken}
            />
          </div>
        )}

        {/* 3. AUTO-REFACTOR & DESIGN PATTERNS TAB */}
        {activeTab === 'refactor' && (
          <div className="space-y-6">
            <AutoRefactorStudio
              currentCode={result?.optimizedCode || code}
              currentLanguage={result?.language || language}
              initialPattern={selectedRefactorPattern}
              onApplyToWorkspace={(refactoredCode, refactoredLang) => {
                setCode(refactoredCode);
                if (refactoredLang) setLanguage(refactoredLang);
                setActiveTab('optimizer');
              }}
              onRunOptimizer={(refactoredCode) => {
                setCode(refactoredCode);
                setActiveTab('optimizer');
                setTimeout(() => {
                  handleOptimize();
                }, 50);
              }}
            />
          </div>
        )}

        {/* 4. HISTORY TAB */}
        {activeTab === 'history' && (
          <HistoryView
            history={history}
            onSelectResult={handleSelectHistoryItem}
            onClearAll={handleClearHistory}
            onDeleteItem={handleDeleteHistoryItem}
            dbStatus={dbStatus}
            onSwitchToOptimizer={() => setActiveTab('optimizer')}
          />
        )}

        {/* 5. PERFORMANCE QUIZ TAB */}
        {activeTab === 'quiz' && <QuizView user={user} />}
      </main>

      {/* Auth Modal for Switching Accounts */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        isMongoConnected={!!dbStatus?.connected}
      />

      {/* macOS Terminal Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-3 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">macOS Notebook Engine</span>
            <span>•</span>
            <span>Optimization & Metrics Suite</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">{user ? `@${user.name}` : 'Developer Session'}</span>
          </div>
          <div className="text-slate-600 text-[11px]">
            Dynamic Resolver Active ({modelStatus?.activeModel || 'gemini-3.7-flash'} • Safe Fallback Ready)
          </div>
        </div>
      </footer>
    </div>
  );
}
