import React from 'react';
import { X, Trash2, Clock, Zap, ArrowRight, ExternalLink, FileCode } from 'lucide-react';
import { OptimizationResult } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: OptimizationResult[];
  onSelect: (item: OptimizationResult) => void;
  onClear: () => void;
  onDeleteSingle: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
  onDeleteSingle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Optimization History</h2>
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {history.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  id="clear-all-history-btn"
                  onClick={onClear}
                  className="p-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Clear all history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                id="close-history-drawer-btn"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <FileCode className="w-10 h-10 mx-auto text-slate-600" />
                <p className="text-sm font-medium">No previous optimizations</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Optimize code snippets and your results will automatically be saved locally for quick access.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id || item.timestamp}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-2 group cursor-pointer"
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
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
                        {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.id) onDeleteSingle(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {item.summary}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-850">
                    <span className="font-mono text-emerald-400">
                      {item.metrics.timeComplexityBefore} → {item.metrics.timeComplexityAfter}
                    </span>
                    <span className="text-amber-300 font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {item.metrics.estimatedSpeedup}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
