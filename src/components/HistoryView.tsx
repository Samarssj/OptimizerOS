import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  ArrowRight, 
  Zap, 
  FileCode, 
  Code2, 
  ExternalLink,
  Copy,
  Check,
  Filter,
  Sparkles,
  ArrowUpRight,
  Download,
  FolderDown,
  FileText
} from 'lucide-react';
import { OptimizationResult, DbStatus } from '../types';
import { getLanguageExtension, downloadFile, generateMarkdownReport, copyToClipboard, normalizeFullSourceCode } from '../utils/exportUtils';
import { ExportModal } from './ExportModal';

interface HistoryViewProps {
  history: OptimizationResult[];
  onSelectResult: (item: OptimizationResult) => void;
  onClearAll: () => void;
  onDeleteItem: (id: string) => void;
  dbStatus?: DbStatus | null;
  onSwitchToOptimizer: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectResult,
  onClearAll,
  onDeleteItem,
  onSwitchToOptimizer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [activeItem, setActiveItem] = useState<OptimizationResult | null>(history[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportItem, setExportItem] = useState<OptimizationResult | null>(null);

  // Extract all unique languages from history
  const languages = ['All', ...Array.from(new Set(history.map((h) => h.language)))];

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.originalCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLang = selectedLanguage === 'All' || item.language === selectedLanguage;

      return matchesSearch && matchesLang;
    });
  }, [history, searchQuery, selectedLanguage]);

  const handleCopyCode = async (code: string, id: string) => {
    await copyToClipboard(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickDownload = (item: OptimizationResult) => {
    const ext = getLanguageExtension(item.language);
    const code = normalizeFullSourceCode(item.optimizedCode);
    downloadFile(code, `optimized_${item.language.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* macOS Window Chrome */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
              <span className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs font-bold text-slate-200">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>optimization_history.log</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500">{history.length} Saved {history.length === 1 ? 'Optimization' : 'Optimizations'}</span>
        </div>

        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Optimization History</h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {history.length} {history.length === 1 ? 'snippet' : 'snippets'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Review, compare, search, and export your previously optimized code snippets
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                id="clear-all-history-page-btn"
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
            <FileCode className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">No Optimizations Yet</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Every code snippet you optimize is automatically saved here for instant review, diff comparison, and file download.
            </p>
          </div>
          <button
            onClick={onSwitchToOptimizer}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Optimize Your First Code</span>
          </button>
        </div>
      ) : (
        /* Main History Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Filterable List */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Search & Language Filters */}
            <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2.5 shadow-md">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search code, summary, language..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Language Pills */}
              {languages.length > 2 && (
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* List items */}
            <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
              {filteredHistory.map((item) => {
                const isSelected = activeItem?.id === item.id;
                const itemId = item.id || String(item.timestamp);

                return (
                  <div
                    key={itemId}
                    onClick={() => setActiveItem(item)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-slate-850 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                        : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700 hover:bg-slate-850/60'
                    }`}
                    style={isSelected ? { backgroundColor: '#131b2e' } : {}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {item.language}
                        </span>
                        <span className="text-[11px] text-slate-400 capitalize">
                          {item.focus}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500">
                          {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : ''}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.id) onDeleteItem(item.id);
                            if (activeItem?.id === item.id) {
                              setActiveItem(history.find((h) => h.id !== item.id) || null);
                            }
                          }}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete snippet from history"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/80">
                      <span className="font-mono text-emerald-400">
                        {item.metrics.timeComplexityBefore} → {item.metrics.timeComplexityAfter}
                      </span>
                      <span className="text-amber-300 font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400" />
                        {item.metrics.estimatedSpeedup}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Inspector Card */}
          <div className="lg:col-span-7">
            {activeItem ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                {/* Header with actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{activeItem.language} Optimization</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {activeItem.metrics.estimatedSpeedup}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Focus: <span className="text-slate-300 capitalize">{activeItem.focus}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Copy Code */}
                    <button
                      onClick={() => handleCopyCode(activeItem.optimizedCode, activeItem.id || 'curr')}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                      title="Copy optimized code"
                    >
                      {copiedId === (activeItem.id || 'curr') ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>

                    {/* Download / Export Button */}
                    <button
                      onClick={() => setExportItem(activeItem)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-cyan-950/60 hover:bg-cyan-900/70 text-cyan-300 border border-cyan-800/60 rounded-lg text-xs font-semibold transition-colors"
                      title="Export and download file"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Download File</span>
                    </button>

                    {/* Open in Studio */}
                    <button
                      onClick={() => onSelectResult(activeItem)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-cyan-600/20"
                    >
                      <span>Open in Studio</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeItem.summary}
                </div>

                {/* Complexity Compare Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium">Time Complexity</div>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                      {activeItem.metrics.timeComplexityBefore} → {activeItem.metrics.timeComplexityAfter}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[11px] text-slate-400 font-medium">Space Complexity</div>
                    <div className="text-xs font-mono font-bold text-cyan-400 mt-1">
                      {activeItem.metrics.spaceComplexityBefore} → {activeItem.metrics.spaceComplexityAfter}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                    <div className="text-[11px] text-slate-400 font-medium">Readability Score</div>
                    <div className="text-xs font-mono font-bold text-amber-300 mt-1">
                      {activeItem.metrics.readabilityScoreBefore}/10 → {activeItem.metrics.readabilityScoreAfter}/10
                    </div>
                  </div>
                </div>

                {/* Optimized Code Preview */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Optimized Production Code:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {normalizeFullSourceCode(activeItem.optimizedCode).split('\n').length} lines
                      </span>
                      <button
                        onClick={() => handleCopyCode(normalizeFullSourceCode(activeItem.optimizedCode), `preview_${activeItem.id}`)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2 py-0.5 bg-emerald-950/50 border border-emerald-800/60 rounded"
                        title="Copy full optimized code"
                      >
                        {copiedId === `preview_${activeItem.id}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied Full!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Full Code</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleQuickDownload(activeItem)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-2 py-0.5 bg-cyan-950/50 border border-cyan-800/60 rounded"
                        title="Direct download file"
                      >
                        <Download className="w-3 h-3" />
                        <span>Direct Save</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-72 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre selection:bg-cyan-500/30 select-text">
                    {normalizeFullSourceCode(activeItem.optimizedCode)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                Select an optimization from the list to inspect details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Export Modal */}
      {exportItem && (
        <ExportModal
          isOpen={!!exportItem}
          onClose={() => setExportItem(null)}
          result={exportItem}
        />
      )}
    </div>
  );
};

