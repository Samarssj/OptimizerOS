import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Repeat,
  ShieldCheck,
  Split,
  Workflow,
  Cpu,
  Layers,
  Copy,
  Check,
  Download,
  ArrowRight,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Gauge,
  TrendingDown,
  RefreshCw,
  Terminal,
  FileCode,
  CornerDownRight,
  Sliders,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { RefactorPatternType, RefactorResult, RefactorChange } from '../types';
import { getLanguageExtension, downloadFile, copyToClipboard, normalizeFullSourceCode } from '../utils/exportUtils';
import { getSafeAuthHeaders } from '../utils/authUtils';

interface AutoRefactorStudioProps {
  currentCode: string;
  currentLanguage: string;
  onApplyToWorkspace: (code: string, language?: string) => void;
  onRunOptimizer: (code: string) => void;
  initialPattern?: RefactorPatternType;
}

interface PatternPreset {
  id: RefactorPatternType;
  title: string;
  category: 'Functional' | 'Behavioral' | 'Structural' | 'Creational' | 'Custom';
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  exampleTransform: string;
  sampleSnippet?: string;
  recommendedFor: string;
}

const PATTERN_PRESETS: PatternPreset[] = [
  {
    id: 'loops-to-functional',
    title: 'Loops → Functional Operations',
    category: 'Functional',
    icon: Repeat,
    description: 'Converts nested imperative loops, index iterations, and mutation arrays into declarative .map(), .filter(), .reduce(), or comprehensions.',
    exampleTransform: 'for (let i...) + push()  ➔  arr.filter(...).map(...)',
    recommendedFor: 'Data processing, array transformations, filtering & aggregations',
  },
  {
    id: 'guard-clauses',
    title: 'Guard Clauses & Early Returns',
    category: 'Behavioral',
    icon: ShieldCheck,
    description: 'Flattens deep arrow-anti-pattern nesting and nested if-else ladders by checking preconditions upfront and returning early.',
    exampleTransform: 'if (valid) { if (auth) { ... } }  ➔  if (!valid) return; if (!auth) return;',
    recommendedFor: 'Controller methods, validation handlers & complex branching',
  },
  {
    id: 'strategy-pattern',
    title: 'Strategy Pattern & Lookup Tables',
    category: 'Behavioral',
    icon: Split,
    description: 'Replaces brittle multi-branch switch/case statements and if-else chains with clean dispatch tables or polymorphic strategy handlers.',
    exampleTransform: 'switch (type) { case A:... case B:... }  ➔  STRATEGY_MAP[type]?.()',
    recommendedFor: 'Payment gateways, event dispatchers, formatters & CLI commands',
  },
  {
    id: 'builder-pipeline',
    title: 'Method Chaining & Pipeline',
    category: 'Structural',
    icon: Workflow,
    description: 'Refactors sequential transformations and multi-step mutations into fluent method chains or composable pipe functions.',
    exampleTransform: 'step1(obj); step2(obj); step3(obj);  ➔  pipeline(step1, step2, step3)(obj)',
    recommendedFor: 'ETL pipelines, builder configs & mathematical transformations',
  },
  {
    id: 'memoization',
    title: 'Memoization & Cache Layer',
    category: 'Structural',
    icon: Cpu,
    description: 'Wraps pure recursive or CPU-intensive functions with an in-memory memoized cache to avoid duplicate computations.',
    exampleTransform: 'fib(n) { return fib(n-1) + fib(n-2) }  ➔  memoizedFib(n, cache = new Map())',
    recommendedFor: 'Dynamic programming, AST parsers & heavy compute routines',
  },
  {
    id: 'immutability-pure',
    title: 'Immutability & Pure Functions',
    category: 'Functional',
    icon: Layers,
    description: 'Eliminates in-place object/array mutations and hidden side-effects, producing pure, deterministic, easily testable functions.',
    exampleTransform: 'target.push(x); delete target.flag;  ➔  return { ...target, items: [...target.items, x] }',
    recommendedFor: 'Redux reducers, state stores & concurrent multi-threaded workloads',
  },
];

export const AutoRefactorStudio: React.FC<AutoRefactorStudioProps> = ({
  currentCode,
  currentLanguage,
  onApplyToWorkspace,
  onRunOptimizer,
  initialPattern = 'loops-to-functional',
}) => {
  const [code, setCode] = useState<string>(currentCode);
  const [language, setLanguage] = useState<string>(currentLanguage || 'TypeScript');
  const [selectedPattern, setSelectedPattern] = useState<RefactorPatternType>(initialPattern);
  const [customInstruction, setCustomInstruction] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RefactorResult | null>(null);
  const [activeDiffTab, setActiveDiffTab] = useState<'refactored' | 'side-by-side' | 'changes'>('refactored');
  const [copied, setCopied] = useState<boolean>(false);
  const [appliedNotification, setAppliedNotification] = useState<boolean>(false);

  // Sync with incoming props if changed
  useEffect(() => {
    if (currentCode && !code) {
      setCode(currentCode);
    }
  }, [currentCode]);

  useEffect(() => {
    if (currentLanguage) {
      setLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  const handleExecuteRefactor = async (patternToUse?: RefactorPatternType) => {
    const pattern = patternToUse || selectedPattern;
    if (!code || !code.trim()) {
      setError('Please paste or write code to refactor.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/refactor', {
        method: 'POST',
        headers: getSafeAuthHeaders(),
        body: JSON.stringify({
          code,
          language,
          patternType: pattern,
          customInstruction: pattern === 'custom' ? customInstruction : undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Refactor failed with status ${response.status}`);
      }

      const data: RefactorResult = await response.json();
      setResult(data);
      setActiveDiffTab('refactored');
    } catch (err: any) {
      console.error('Refactoring error:', err);
      setError(err.message || 'Failed to auto-refactor code. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!result) return;
    const cleanCode = normalizeFullSourceCode(result.refactoredCode);
    await copyToClipboard(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    const ext = getLanguageExtension(result.language);
    const cleanCode = normalizeFullSourceCode(result.refactoredCode);
    downloadFile(
      cleanCode,
      `refactored_${result.patternType.replace(/[^a-z0-9]/gi, '_')}.${ext}`
    );
  };

  const handleApply = () => {
    if (!result) return;
    const cleanCode = normalizeFullSourceCode(result.refactoredCode);
    onApplyToWorkspace(cleanCode, result.language);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  const selectedPresetObj = PATTERN_PRESETS.find((p) => p.id === selectedPattern);

  return (
    <div className="space-y-6 font-mono">
      {/* Top Banner & Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-cyan-500/5 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Auto-Refactor & Design Pattern Studio
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Transform imperative algorithms, deep nesting, and loop bottlenecks into clean, functional, and maintainable design patterns.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {result && (
              <button
                id="refactor-apply-to-workspace-btn"
                type="button"
                onClick={handleApply}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all shadow-md active:scale-95"
              >
                {appliedNotification ? <Check className="w-4 h-4" /> : <CornerDownRight className="w-4 h-4" />}
                <span>{appliedNotification ? 'Applied to Workspace!' : 'Apply to Workspace'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pattern Selector Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Design Pattern Improvement</span>
          </h2>
          <span className="text-[11px] text-slate-500">6 Specialized Patterns + Custom</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PATTERN_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedPattern === preset.id;
            return (
              <button
                key={preset.id}
                id={`pattern-btn-${preset.id}`}
                type="button"
                onClick={() => setSelectedPattern(preset.id)}
                className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/70 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${
                      isSelected
                        ? 'bg-cyan-900/60 text-cyan-300 border-cyan-700'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {preset.category}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-sm font-bold tracking-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {preset.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono text-cyan-400/90 truncate">
                  {preset.exampleTransform}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Input & Execution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Input & Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-slate-200">Source Snippet</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-slate-950 text-xs text-slate-300 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-500"
                >
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="C#">C#</option>
                </select>
                <button
                  type="button"
                  onClick={() => setCode(currentCode)}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 underline"
                  title="Load current workspace code"
                >
                  Sync Workspace
                </button>
              </div>
            </div>

            {/* Code Textarea with macOS styling */}
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste code or function containing nested loops, conditionals, or state to refactor..."
                rows={12}
                className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500/70 focus:ring-1 focus:ring-cyan-500/50 resize-y leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Optional Custom Instructions */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center justify-between">
                <span>Optional Refactor Guidance / Context</span>
                <span className="text-[10px] text-slate-500">e.g. "Use flatMap instead of reduce"</span>
              </label>
              <input
                type="text"
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="Specific library, immutability constraint, or helper preference..."
                className="w-full bg-slate-950 text-slate-300 text-xs px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Execute Refactoring Button */}
            <button
              id="execute-refactor-btn"
              type="button"
              disabled={isLoading || !code.trim()}
              onClick={() => handleExecuteRefactor()}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 hover:from-cyan-300 hover:to-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-950/40 active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Refactoring AST & Patterns with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Apply {selectedPresetObj?.title || 'Design Pattern'}</span>
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-rose-950/50 border border-rose-800/60 rounded-xl text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Refactored Result & Architectural Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
              {/* Header with Pattern Badge & Metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{result.patternName}</span>
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {result.category}
                    </span>
                    {result.modelUsed && (
                      <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {result.modelUsed}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="copy-refactored-code-btn"
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    id="download-refactored-code-btn"
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-cyan-300 hover:text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Cognitive Complexity & Lines Scoreboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-amber-400" />
                    Cognitive Complexity
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm line-through text-rose-400">{result.cognitiveComplexityBefore}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-base font-bold text-emerald-400">{result.cognitiveComplexityAfter}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 text-cyan-400" />
                    Lines of Code
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">{result.linesBefore}</span>
                    <ArrowRight className="w-3 h-3 text-slate-500" />
                    <span className="text-base font-bold text-cyan-300">{result.linesAfter}</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Repeat className="w-3 h-3 text-emerald-400" />
                    Paradigm
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {result.category === 'Functional' ? 'Declarative Stream' : 'Pattern Decoupled'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Safety
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    Behavior Preserved
                  </span>
                </div>
              </div>

              {/* View Switcher Tabs (Refactored Code vs Applied Changes) */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveDiffTab('refactored')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeDiffTab === 'refactored'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Refactored Code
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDiffTab('changes')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeDiffTab === 'changes'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>Architectural Changes</span>
                  <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-300">
                    {result.appliedChanges.length}
                  </span>
                </button>
              </div>

              {/* Tab 1: Refactored Code Viewer */}
              {activeDiffTab === 'refactored' && (
                <div className="space-y-4">
                  <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                    <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Refactored Output ({result.language})</span>
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                        <Check className="w-3 h-3" /> Ready for production
                      </span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed max-h-96">
                      <code>{result.refactoredCode}</code>
                    </pre>
                  </div>

                  {/* Actions under Code */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      id="run-optimized-benchmark-btn"
                      type="button"
                      onClick={() => onRunOptimizer(result.refactoredCode)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 transition-colors"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>Benchmark In Optimizer Matrix</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleApply}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md"
                    >
                      <CornerDownRight className="w-4 h-4" />
                      <span>Apply to Active Editor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Architectural Changes Breakdown */}
              {activeDiffTab === 'changes' && (
                <div className="space-y-3">
                  {result.appliedChanges.map((change, idx) => (
                    <div key={idx} className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-[11px] font-bold flex items-center justify-center border border-cyan-500/30">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-white">{change.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {change.explanation}
                      </p>

                      {(change.beforeSnippet || change.afterSnippet) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {change.beforeSnippet && (
                            <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-2.5 text-[11px] font-mono text-rose-300 overflow-x-auto">
                              <div className="text-[10px] text-rose-400 font-semibold mb-1">Before:</div>
                              <code>{change.beforeSnippet}</code>
                            </div>
                          )}
                          {change.afterSnippet && (
                            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-2.5 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                              <div className="text-[10px] text-emerald-400 font-semibold mb-1">After:</div>
                              <code>{change.afterSnippet}</code>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Benefits & Tradeoffs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Pattern Architectural Benefits</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Tradeoffs & Notes</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {result.tradeoffs.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggested Next Patterns to Chain */}
              {result.suggestedNextPatterns && result.suggestedNextPatterns.length > 0 && (
                <div className="bg-slate-950/60 rounded-xl border border-slate-800/80 p-3.5 space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Workflow className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Suggested Next Refactoring Steps</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.suggestedNextPatterns.map((pat, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCode(result.refactoredCode);
                          setCustomInstruction(`Apply: ${pat}`);
                          handleExecuteRefactor('custom');
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 transition-all flex items-center gap-1"
                      >
                        <span>{pat}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty placeholder state */
            <div className="bg-slate-900/60 border border-slate-800/80 border-dashed rounded-2xl p-10 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-base font-bold text-white">
                  Ready to Refactor Design Patterns
                </h3>
                <p className="text-xs text-slate-400">
                  Select a pattern above (such as converting nested loops to functional map/filter operations) and click <strong>Apply Design Pattern</strong> to generate an architectural transformation with cognitive complexity metrics.
                </p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleExecuteRefactor('loops-to-functional')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 transition-colors flex items-center gap-1.5"
                >
                  <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Try: Loops → Functional Streams</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
