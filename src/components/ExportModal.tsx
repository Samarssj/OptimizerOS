import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  FileCode, 
  FileText, 
  FileJson, 
  GitPullRequest, 
  Sparkles,
  CheckCircle2,
  FolderDown,
  Code
} from 'lucide-react';
import { OptimizationResult } from '../types';
import { 
  getLanguageExtension, 
  downloadFile, 
  generateMarkdownReport, 
  generateGitDiff,
  copyToClipboard,
  normalizeFullSourceCode
} from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: OptimizationResult;
}

type ExportFormat = 'source' | 'markdown' | 'json' | 'diff';

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const ext = getLanguageExtension(result.language);
  const defaultBaseName = `optimized_${result.language.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

  const [filename, setFilename] = useState(`${defaultBaseName}.${ext}`);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('source');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const cleanOptCode = normalizeFullSourceCode(result.optimizedCode);
  const cleanOrigCode = normalizeFullSourceCode(result.originalCode);

  // Compute contents based on format
  const getFormatContent = (format: ExportFormat): { content: string; defaultName: string; mime: string } => {
    switch (format) {
      case 'source':
        return {
          content: cleanOptCode,
          defaultName: `${defaultBaseName}.${ext}`,
          mime: 'text/plain;charset=utf-8',
        };
      case 'markdown':
        return {
          content: generateMarkdownReport({ ...result, optimizedCode: cleanOptCode, originalCode: cleanOrigCode }),
          defaultName: `${defaultBaseName}_report.md`,
          mime: 'text/markdown;charset=utf-8',
        };
      case 'json':
        return {
          content: JSON.stringify({ ...result, optimizedCode: cleanOptCode, originalCode: cleanOrigCode }, null, 2),
          defaultName: `${defaultBaseName}_result.json`,
          mime: 'application/json;charset=utf-8',
        };
      case 'diff':
        return {
          content: generateGitDiff(cleanOrigCode, cleanOptCode, `code.${ext}`),
          defaultName: `${defaultBaseName}.patch`,
          mime: 'text/x-diff;charset=utf-8',
        };
    }
  };

  const currentPayload = getFormatContent(selectedFormat);

  const handleSelectFormat = (format: ExportFormat) => {
    setSelectedFormat(format);
    const payload = getFormatContent(format);
    setFilename(payload.defaultName);
  };

  const handleDownload = () => {
    downloadFile(currentPayload.content, filename || currentPayload.defaultName, currentPayload.mime);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopy = async () => {
    await copyToClipboard(currentPayload.content);
    setCopiedFormat(selectedFormat);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="export-modal-dialog"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FolderDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Export & Download Optimization
              </h3>
              <p className="text-xs text-slate-400">
                Save the optimized source file or full performance analysis directly to your local computer.
              </p>
            </div>
          </div>

          <button
            id="close-export-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Format Selector Cards */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
              Select Export Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* 1. Source Code */}
              <button
                type="button"
                id="export-format-source"
                onClick={() => handleSelectFormat('source')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                  selectedFormat === 'source'
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileCode className={`w-4 h-4 ${selectedFormat === 'source' ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    .{ext}
                  </span>
                </div>
                <div className="font-semibold text-xs">Source Code</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">Ready-to-run file</div>
              </button>

              {/* 2. Markdown Report */}
              <button
                type="button"
                id="export-format-markdown"
                onClick={() => handleSelectFormat('markdown')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                  selectedFormat === 'markdown'
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileText className={`w-4 h-4 ${selectedFormat === 'markdown' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    .md
                  </span>
                </div>
                <div className="font-semibold text-xs">PR / Doc Report</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">Full Big-O analysis</div>
              </button>

              {/* 3. JSON Data */}
              <button
                type="button"
                id="export-format-json"
                onClick={() => handleSelectFormat('json')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                  selectedFormat === 'json'
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileJson className={`w-4 h-4 ${selectedFormat === 'json' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    .json
                  </span>
                </div>
                <div className="font-semibold text-xs">Raw JSON Data</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">Structured AST payload</div>
              </button>

              {/* 4. Git Diff Patch */}
              <button
                type="button"
                id="export-format-diff"
                onClick={() => handleSelectFormat('diff')}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                  selectedFormat === 'diff'
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <GitPullRequest className={`w-4 h-4 ${selectedFormat === 'diff' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    .patch
                  </span>
                </div>
                <div className="font-semibold text-xs">Git Diff Patch</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">git apply ready</div>
              </button>
            </div>
          </div>

          {/* Filename Input */}
          <div>
            <label htmlFor="export-filename-input" className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              File Name on Local Disk
            </label>
            <div className="flex items-center">
              <input
                id="export-filename-input"
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="optimized_code.ext"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 font-mono focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Live Preview Box */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1.5">
              <span>Preview ({selectedFormat.toUpperCase()}):</span>
              <span className="font-mono text-[11px] text-slate-500">
                {currentPayload.content.split('\n').length} lines • {currentPayload.content.length} bytes
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 max-h-48 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre leading-relaxed select-text">
              {currentPayload.content}
            </div>
          </div>

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>{filename}</strong> downloaded successfully to your local machine!
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Speedup: <strong>{result.metrics.estimatedSpeedup}</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Copy Button */}
            <button
              type="button"
              id="export-copy-clipboard-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedFormat === selectedFormat ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              type="button"
              id="export-download-file-btn"
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
