import React, { useState } from 'react';
import { 
  Zap, 
  Timer, 
  Database, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Download,
  Copy,
  Check,
  FolderDown,
  Share2
} from 'lucide-react';
import { OptimizationMetrics, OptimizationResult } from '../types';
import { getLanguageExtension, downloadFile, generateMarkdownReport, copyToClipboard, normalizeFullSourceCode } from '../utils/exportUtils';
import { ExportModal } from './ExportModal';

interface OptimizationSummaryProps {
  summary: string;
  metrics: OptimizationMetrics;
  language: string;
  focus: string;
  result?: OptimizationResult;
  onNavigateToRefactor?: (pattern?: string) => void;
}

export const OptimizationSummary: React.FC<OptimizationSummaryProps> = ({
  summary,
  metrics,
  language,
  focus,
  result,
  onNavigateToRefactor,
}) => {
  const [copiedReport, setCopiedReport] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const readabilityImprovement = metrics.readabilityScoreAfter - metrics.readabilityScoreBefore;

  const handleCopyReport = async () => {
    if (!result) return;
    const markdown = generateMarkdownReport(result);
    await copyToClipboard(markdown);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleCopyOptimizedCode = async () => {
    if (!result || !result.optimizedCode) return;
    await copyToClipboard(result.optimizedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleQuickDownload = () => {
    if (!result) return;
    const ext = getLanguageExtension(result.language);
    downloadFile(result.optimizedCode, `optimized_${result.language.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Header Verdict */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Optimization Analysis & Wins
            </h2>
            <p className="text-xs text-slate-400">
              Language: <span className="text-cyan-400 font-medium">{language}</span> • Focus: <span className="text-slate-300 capitalize">{focus}</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Speedup Badge */}
        <div className="flex items-center gap-2 flex-wrap">
          {result && (
            <>
              {/* Copy Full Optimized Code Button */}
              <button
                id="copy-summary-code-btn"
                type="button"
                onClick={handleCopyOptimizedCode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/30 transition-all active:scale-95"
                title="Copy full optimized code to clipboard"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                <span>{copiedCode ? 'Full Code Copied!' : 'Copy Full Code'}</span>
              </button>

              {/* Copy Report */}
              <button
                id="copy-summary-report-btn"
                type="button"
                onClick={handleCopyReport}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 border border-slate-700 transition-colors"
                title="Copy full performance analysis report as Markdown"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copiedReport ? 'Report Copied' : 'Copy Report'}</span>
              </button>

              {/* Export / Download Modal Trigger */}
              <button
                id="summary-export-download-btn"
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-800/60 hover:border-cyan-700 transition-colors shadow-sm"
                title="Export code file or analysis report directly to your computer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export / Save</span>
              </button>
            </>
          )}

          {/* Speedup Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold shadow-sm">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{metrics.estimatedSpeedup}</span>
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
        {summary}
      </p>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
        {/* Time Complexity */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-cyan-400" />
              Time Complexity
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              Performance
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm sm:text-base">
            <span className="text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded">
              {metrics.timeComplexityBefore}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded font-bold">
              {metrics.timeComplexityAfter}
            </span>
          </div>
        </div>

        {/* Space / Memory Complexity */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-400" />
              Space Complexity
            </span>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
              Memory Footprint
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-sm sm:text-base">
            <span className="text-slate-300 bg-slate-800/60 border border-slate-700/60 px-2 py-0.5 rounded">
              {metrics.spaceComplexityBefore}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span className="text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded font-bold">
              {metrics.spaceComplexityAfter}
            </span>
          </div>
        </div>

        {/* Readability & Code Quality */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Readability Rating
            </span>
            <span className="text-xs font-bold text-amber-300">
              {metrics.readabilityScoreBefore}/10 → <span className="text-emerald-400">{metrics.readabilityScoreAfter}/10</span>
              {readabilityImprovement > 0 && ` (+${readabilityImprovement})`}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex my-auto">
            <div 
              className="bg-emerald-400 h-full rounded-full transition-all duration-700" 
              style={{ width: `${(metrics.readabilityScoreAfter / 10) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 mt-1.5">
            <span>Messy / Unidiomatic</span>
            <span className="text-emerald-400 font-medium">Clean & Maintainable</span>
          </div>
        </div>
      </div>

      {/* Auto-Refactor Quick Suggestion Bar */}
      {onNavigateToRefactor && (
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/20 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Want to apply structural Design Patterns?</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                  New
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Transform nested loops into functional map/filter operations, flatten nested ifs with guard clauses, or add memoization.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              id="summary-refactor-loops-btn"
              type="button"
              onClick={() => onNavigateToRefactor('loops-to-functional')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all flex items-center gap-1 shadow-sm"
            >
              <span>Auto-Refactor Patterns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {result && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          result={result}
        />
      )}
    </div>
  );
};
