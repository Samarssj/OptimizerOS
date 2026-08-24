import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  Columns2, 
  GitCommit, 
  Code, 
  Maximize2, 
  Minimize2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Filter,
  FileCode,
  Share2,
  WrapText,
  ZoomIn,
  ZoomOut,
  FolderDown,
  Layers,
  ArrowDownCircle,
  Eye
} from 'lucide-react';
import * as Diff from 'diff';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import { getLanguageExtension, downloadFile, copyToClipboard, normalizeFullSourceCode } from '../utils/exportUtils';
import { ExportModal } from './ExportModal';
import { OptimizationResult } from '../types';

interface DiffViewerProps {
  originalCode: string;
  optimizedCode: string;
  language: string;
  result?: OptimizationResult;
}

type ViewMode = 'split' | 'unified' | 'optimized-only';

export const DiffViewer: React.FC<DiffViewerProps> = ({
  originalCode,
  optimizedCode,
  language,
  result,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [copiedType, setCopiedType] = useState<'optimized' | 'diff' | 'original' | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(false);
  const [isWordWrap, setIsWordWrap] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('sm');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);

  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef(false);

  // Normalize source codes to ensure full multi-line fidelity with accurate newlines
  const cleanOriginalCode = useMemo(() => normalizeFullSourceCode(originalCode), [originalCode]);
  const cleanOptimizedCode = useMemo(() => normalizeFullSourceCode(optimizedCode), [optimizedCode]);

  // Map language name to Prism grammar ID
  const prismLang = useMemo(() => {
    const l = language.toLowerCase();
    if (l.includes('type') || l.includes('ts')) return 'typescript';
    if (l.includes('py')) return 'python';
    if (l.includes('c++') || l.includes('cpp')) return 'cpp';
    if (l.includes('c#') || l.includes('cs')) return 'csharp';
    if (l.includes('java') && !l.includes('script')) return 'java';
    if (l.includes('rust') || l.includes('rs')) return 'rust';
    if (l.includes('go')) return 'go';
    if (l.includes('sql')) return 'sql';
    if (l.includes('php')) return 'php';
    if (l.includes('ruby')) return 'ruby';
    if (l.includes('bash') || l.includes('sh')) return 'bash';
    return 'javascript';
  }, [language]);

  // Compute unified line diffs
  const diffLines = useMemo(() => {
    return Diff.diffLines(cleanOriginalCode, cleanOptimizedCode);
  }, [cleanOriginalCode, cleanOptimizedCode]);

  // Compute stats: additions, deletions, modifications
  const diffStats = useMemo(() => {
    let added = 0;
    let removed = 0;
    let unchanged = 0;

    diffLines.forEach((part) => {
      const count = part.value.split('\n').filter(Boolean).length;
      if (part.added) added += count;
      else if (part.removed) removed += count;
      else unchanged += count;
    });

    return { added, removed, unchanged, totalChanges: added + removed };
  }, [diffLines]);

  // Synchronize scrolling between left and right in Split View
  const handleScrollLeft = () => {
    if (isSyncingScroll.current || !leftPaneRef.current || !rightPaneRef.current) return;
    isSyncingScroll.current = true;
    rightPaneRef.current.scrollTop = leftPaneRef.current.scrollTop;
    setTimeout(() => {
      isSyncingScroll.current = false;
    }, 50);
  };

  const handleScrollRight = () => {
    if (isSyncingScroll.current || !leftPaneRef.current || !rightPaneRef.current) return;
    isSyncingScroll.current = true;
    leftPaneRef.current.scrollTop = rightPaneRef.current.scrollTop;
    setTimeout(() => {
      isSyncingScroll.current = false;
    }, 50);
  };

  const handleCopy = async (text: string, type: 'optimized' | 'diff' | 'original') => {
    await copyToClipboard(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleQuickDownload = () => {
    const ext = getLanguageExtension(language);
    downloadFile(cleanOptimizedCode, `optimized_${language.toLowerCase().replace(/[^a-z0-9]/g, '_')}.${ext}`);
  };

  // Helper to render syntax highlighted HTML
  const highlightCode = (codeText: string) => {
    try {
      const grammar = Prism.languages[prismLang] || Prism.languages.javascript;
      return Prism.highlight(codeText, grammar, prismLang);
    } catch {
      return codeText;
    }
  };

  const origLines = useMemo(() => cleanOriginalCode.split('\n'), [cleanOriginalCode]);
  const optLines = useMemo(() => cleanOptimizedCode.split('\n'), [cleanOptimizedCode]);

  const fontSizeClass = {
    sm: 'text-xs leading-5',
    base: 'text-sm leading-6',
    lg: 'text-base leading-7',
  }[fontSize];

  return (
    <div
      id="code-comparison-visualizer"
      className={`bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono transition-all duration-200 ${
        isFullscreen ? 'fixed inset-3 z-50 shadow-2xl max-w-none' : ''
      }`}
    >
      {/* 1. Comparison Header & High-Level Diff Stats */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Title and View Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-white pl-2 border-l border-slate-800">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>diff_viewer.sh — AST Diff</span>
          </div>

          {/* View Mode Selector Tabs */}
          <div className="flex items-center bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/70">
            <button
              id="diff-split-mode-btn"
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Side-by-side split comparison"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split View</span>
            </button>

            <button
              id="diff-unified-mode-btn"
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'unified'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Unified git diff view"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unified Diff</span>
            </button>

            <button
              id="diff-optimized-only-btn"
              onClick={() => setViewMode('optimized-only')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'optimized-only'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="View only clean optimized code"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Optimized Only</span>
            </button>
          </div>

          {/* Diff Impact Pill */}
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
            <span className="text-emerald-400 font-semibold">+{diffStats.added}</span>
            <span className="text-rose-400 font-semibold">-{diffStats.removed}</span>
            <span className="text-slate-500">lines changed</span>
          </div>
        </div>

        {/* Action buttons (Copy, Download, Fullscreen, Options) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Copy Optimized Code Button */}
          <button
            id="copy-optimized-code-btn"
            onClick={() => handleCopy(cleanOptimizedCode, 'optimized')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-lg shadow-md shadow-emerald-950/40 transition-all active:scale-95"
            title="Copy full optimized code to clipboard"
          >
            {copiedType === 'optimized' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied Full Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                <span>Copy Full Optimized Code</span>
              </>
            )}
          </button>

          {/* Download / Export Hub */}
          <button
            id="download-export-hub-btn"
            onClick={() => {
              if (result) {
                setIsExportModalOpen(true);
              } else {
                handleQuickDownload();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-200 bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-800/60 hover:border-cyan-700 rounded-lg transition-all"
            title="Export and download file to local machine"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export / Download</span>
            <span className="sm:hidden">Save</span>
          </button>

          {/* Display Controls (Word wrap, Font Size) */}
          <button
            id="toggle-word-wrap-btn"
            onClick={() => setIsWordWrap(!isWordWrap)}
            className={`p-1.5 rounded-lg border text-xs transition-colors hidden sm:flex items-center ${
              isWordWrap
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
            }`}
            title={isWordWrap ? 'Disable Word Wrap' : 'Enable Word Wrap'}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            id="diff-fullscreen-toggle-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Code Visualizer'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Visual Diff Visualizer Body */}
      <div className="flex-1 overflow-hidden bg-slate-950 font-mono">
        {/* MODE 1: SPLIT VIEW (SIDE BY SIDE WITH SYNCHRONIZED SCROLLING) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-w-full">
            {/* Left: Original Code */}
            <div className="flex flex-col">
              <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-rose-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Original Code (Suboptimal)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">{origLines.length} lines</span>
                  <button
                    onClick={() => handleCopy(cleanOriginalCode, 'original')}
                    className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-slate-800"
                    title="Copy full original code"
                  >
                    {copiedType === 'original' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div 
                ref={leftPaneRef}
                onScroll={handleScrollLeft}
                className="p-3 overflow-y-auto max-h-[480px] lg:max-h-[560px] select-text"
              >
                <table className={`w-full border-collapse font-mono ${fontSizeClass}`}>
                  <tbody>
                    {origLines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/50">
                        <td className="w-8 select-none pr-3 text-right text-[11px] text-slate-600 font-mono align-top">
                          {idx + 1}
                        </td>
                        <td className={`text-slate-300 font-mono ${isWordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}`}>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightCode(line || ' '),
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Optimized Code */}
            <div className="flex flex-col bg-slate-950/40">
              <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    Optimized Production Version
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-mono">{optLines.length} lines</span>
                  <button
                    onClick={() => handleCopy(cleanOptimizedCode, 'optimized')}
                    className="p-1 text-emerald-400 hover:text-emerald-300 rounded hover:bg-slate-800 flex items-center gap-1 text-xs"
                    title="Copy full optimized code"
                  >
                    {copiedType === 'optimized' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy Full</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div 
                ref={rightPaneRef}
                onScroll={handleScrollRight}
                className="p-3 overflow-y-auto max-h-[480px] lg:max-h-[560px] select-text"
              >
                <table className={`w-full border-collapse font-mono ${fontSizeClass}`}>
                  <tbody>
                    {optLines.map((line, idx) => (
                      <tr key={idx} className="hover:bg-emerald-950/20">
                        <td className="w-8 select-none pr-3 text-right text-[11px] text-emerald-600/70 font-mono align-top">
                          {idx + 1}
                        </td>
                        <td className={`text-slate-200 font-mono ${isWordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}`}>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightCode(line || ' '),
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: UNIFIED GIT-STYLE DIFF */}
        {viewMode === 'unified' && (
          <div className="flex flex-col">
            <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> - Removed / Suboptimal ({diffStats.removed} lines)
                </span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> + Added / Optimized ({diffStats.added} lines)
                </span>
              </div>

              <button
                onClick={() => {
                  const unifiedText = diffLines.map((p) => {
                    const prefix = p.added ? '+ ' : p.removed ? '- ' : '  ';
                    return p.value.split('\n').map((l) => prefix + l).join('\n');
                  }).join('\n');
                  handleCopy(unifiedText, 'diff');
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-slate-200 text-xs"
              >
                {copiedType === 'diff' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'diff' ? 'Diff Copied' : 'Copy Unified Diff'}</span>
              </button>
            </div>

            <div className="p-3 overflow-y-auto max-h-[520px] select-text">
              <table className={`w-full border-collapse font-mono ${fontSizeClass}`}>
                <tbody>
                  {(() => {
                    let oldLineNum = 1;
                    let newLineNum = 1;
                    const rows: React.ReactNode[] = [];

                    diffLines.forEach((part, partIdx) => {
                      const lines = part.value.replace(/\n$/, '').split('\n');
                      const isAdded = part.added;
                      const isRemoved = part.removed;

                      lines.forEach((lineText, lineIdx) => {
                        const key = `${partIdx}-${lineIdx}`;
                        let bgClass = 'hover:bg-slate-900/40';
                        let prefix = ' ';
                        let prefixClass = 'text-slate-600';

                        if (isAdded) {
                          bgClass = 'bg-emerald-950/40 text-emerald-200 border-l-2 border-emerald-500';
                          prefix = '+';
                          prefixClass = 'text-emerald-400 font-bold';
                        } else if (isRemoved) {
                          bgClass = 'bg-rose-950/40 text-rose-200 border-l-2 border-rose-500 opacity-80';
                          prefix = '-';
                          prefixClass = 'text-rose-400 font-bold';
                        }

                        rows.push(
                          <tr key={key} className={`${bgClass} transition-colors`}>
                            <td className="w-8 select-none px-2 text-right text-[11px] text-slate-600 font-mono">
                              {!isAdded ? oldLineNum++ : ''}
                            </td>
                            <td className="w-8 select-none px-2 text-right text-[11px] text-slate-600 font-mono">
                              {!isRemoved ? newLineNum++ : ''}
                            </td>
                            <td className={`w-4 select-none px-1 text-center font-mono ${prefixClass}`}>
                              {prefix}
                            </td>
                            <td className={`pl-2 font-mono ${isWordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}`}>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: highlightCode(lineText || ' '),
                                }}
                              />
                            </td>
                          </tr>
                        );
                      });
                    });

                    return rows;
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODE 3: OPTIMIZED ONLY (CLEAN READY TO USE) */}
        {viewMode === 'optimized-only' && (
          <div className="flex flex-col">
            <div className="px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-semibold text-emerald-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Optimized Production Ready Code
              </span>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-mono text-[11px]">{optLines.length} lines</span>
                <button
                  onClick={() => handleCopy(cleanOptimizedCode, 'optimized')}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 px-2 py-1 bg-emerald-950/50 border border-emerald-800/60 rounded-md"
                  title="Copy complete optimized code"
                >
                  {copiedType === 'optimized' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleQuickDownload}
                  className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 bg-slate-800 rounded-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[520px] select-text">
              <table className={`w-full border-collapse font-mono ${fontSizeClass}`}>
                <tbody>
                  {optLines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="w-10 select-none pr-4 text-right text-[11px] text-slate-600 font-mono align-top">
                        {idx + 1}
                      </td>
                      <td className={`text-slate-200 font-mono ${isWordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'}`}>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightCode(line || ' '),
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
