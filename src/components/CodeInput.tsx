import React, { useState, useRef } from 'react';
import { 
  Play, 
  Sparkles, 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  FileCode, 
  Sliders, 
  Lightbulb, 
  Zap, 
  ChevronDown,
  Info
} from 'lucide-react';
import { OptimizationFocus } from '../types';
import { SUPPORTED_LANGUAGES, FOCUS_PRESETS, SAMPLE_CODES } from '../data/samples';

interface CodeInputProps {
  code: string;
  onChangeCode: (val: string) => void;
  language: string;
  onChangeLanguage: (val: string) => void;
  focus: OptimizationFocus;
  onChangeFocus: (val: OptimizationFocus) => void;
  onOptimize: () => void;
  isLoading: boolean;
  onSelectSample: (sampleId: string) => void;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  code,
  onChangeCode,
  language,
  onChangeLanguage,
  focus,
  onChangeFocus,
  onOptimize,
  isLoading,
  onSelectSample,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSampleMenu, setShowSampleMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lineCount = code ? code.split('\n').length : 1;
  const charCount = code.length;

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect language from extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'js' || ext === 'jsx') onChangeLanguage('JavaScript');
    else if (ext === 'ts' || ext === 'tsx') onChangeLanguage('TypeScript');
    else if (ext === 'py') onChangeLanguage('Python');
    else if (ext === 'cpp' || ext === 'cc' || ext === 'h') onChangeLanguage('C++');
    else if (ext === 'java') onChangeLanguage('Java');
    else if (ext === 'rs') onChangeLanguage('Rust');
    else if (ext === 'go') onChangeLanguage('Go');
    else if (ext === 'sql') onChangeLanguage('SQL');
    else if (ext === 'cs') onChangeLanguage('C#');
    else if (ext === 'php') onChangeLanguage('PHP');
    else if (ext === 'rb') onChangeLanguage('Ruby');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onChangeCode(content);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Cmd+Enter or Ctrl+Enter to trigger optimization
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && code.trim()) {
        onOptimize();
      }
    }
    // Tab key support in textarea
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const updated = code.substring(0, start) + '  ' + code.substring(end);
      onChangeCode(updated);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const currentFocusConfig = FOCUS_PRESETS.find((f) => f.id === focus) || FOCUS_PRESETS[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono">
      {/* macOS Terminal Window Titlebar */}
      <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* macOS Traffic Lights */}
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 inline-block transition-opacity cursor-pointer" />
          </div>

          {/* macOS Notebook Tab */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs font-semibold text-slate-200">
            <div className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-cyan-300">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>notebook_editor.{language.toLowerCase() === 'javascript' ? 'js' : language.toLowerCase() === 'python' ? 'py' : language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase() === 'rust' ? 'rs' : 'ts'}</span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">— UTF-8 • {language}</span>
          </div>
        </div>

        {/* Action utility buttons */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".js,.ts,.jsx,.tsx,.py,.cpp,.c,.java,.rs,.go,.sql,.cs,.php,.rb,.swift,.kt,.txt"
          />
          <button
            id="upload-code-file-btn"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            title="Upload source file"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {code && (
            <>
              <button
                id="copy-input-code-btn"
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                title="Copy input code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                id="clear-input-code-btn"
                type="button"
                onClick={() => onChangeCode('')}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded-lg transition-colors"
                title="Clear editor"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Language & Samples Secondary Toolbar */}
      <div className="px-4 py-2 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="font-semibold text-slate-400">
            Language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-cyan-500 focus:outline-none cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          {/* Sample Selector Dropdown */}
          <div className="relative">
            <button
              id="sample-picker-btn"
              type="button"
              onClick={() => setShowSampleMenu(!showSampleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors font-mono"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Preset Sample</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSampleMenu && (
              <div 
                className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-slate-850 border border-slate-700 rounded-xl shadow-2xl z-50 p-1.5 backdrop-blur-xl"
                style={{ backgroundColor: '#1e293b' }}
              >
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-700/60 mb-1">
                  Bottleneck Examples
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {SAMPLE_CODES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => {
                        onSelectSample(sample.id);
                        setShowSampleMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-700/60 transition-colors group"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-200 group-hover:text-cyan-400">
                        <span>{sample.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {sample.language}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {sample.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono hidden sm:flex items-center gap-2">
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>

      {/* Optimization Focus Selector Pills */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Focus:
        </span>
        <div className="flex items-center gap-1.5 flex-nowrap">
          {FOCUS_PRESETS.map((p) => {
            const isSelected = focus === p.id;
            return (
              <button
                key={p.id}
                id={`focus-${p.id}-btn`}
                type="button"
                onClick={() => onChangeFocus(p.id)}
                className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-800/70 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-700/60'
                }`}
                title={p.description}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editor Main Canvas with Line Numbers */}
      <div className="relative flex-1 min-h-[300px] lg:min-h-[380px] bg-slate-950 flex font-mono text-xs sm:text-sm">
        {/* Line Numbers gutter */}
        <div 
          className="select-none py-3 px-2 text-right text-slate-600 bg-slate-950/90 border-r border-slate-800/80 w-10 sm:w-12 font-mono text-xs overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: Math.max(lineCount, 15) }, (_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <div className="relative flex-1">
          <textarea
            id="code-input-textarea"
            value={code}
            onChange={(e) => onChangeCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`// Paste or write the code you want to optimize here...
// E.g. slow nested loops, heavy allocations, unoptimized queries, recursive trees...
// Press Cmd+Enter or click 'Optimize & Explain Code' below.`}
            className="w-full h-full min-h-[300px] lg:min-h-[380px] p-3 bg-transparent text-slate-100 placeholder-slate-600 font-mono text-xs sm:text-sm leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Bottom Footer & Run CTA */}
      <div className="px-4 py-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>{lineCount} lines</span>
          </span>
          <span>{charCount} chars</span>
          <span className="hidden md:inline text-slate-500">
            Targeting: <strong className="text-slate-300 font-medium">{currentFocusConfig.label}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 text-[10px]">Ctrl</kbd>
            {' + '}
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 text-[10px]">Enter</kbd>
          </span>

          <button
            id="optimize-code-submit-btn"
            type="button"
            disabled={isLoading || !code.trim()}
            onClick={onOptimize}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg ${
              isLoading || !code.trim()
                ? 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-70'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing & Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Optimize & Explain Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
