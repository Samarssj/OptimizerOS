import React from 'react';
import { 
  CheckCircle2, 
  Activity, 
  AlertCircle, 
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { OptimizationResult } from '../types';

interface TestingTipsProps {
  result: OptimizationResult;
}

export const TestingTips: React.FC<TestingTipsProps> = ({ result }) => {
  const [copiedReport, setCopiedReport] = React.useState(false);

  const handleCopyReport = () => {
    const report = `# Code Optimization Analysis Report
**Language**: ${result.language}
**Focus**: ${result.focus}
**Speedup**: ${result.metrics.estimatedSpeedup}
**Time Complexity**: ${result.metrics.timeComplexityBefore} -> ${result.metrics.timeComplexityAfter}
**Space Complexity**: ${result.metrics.spaceComplexityBefore} -> ${result.metrics.spaceComplexityAfter}
**Readability Score**: ${result.metrics.readabilityScoreBefore}/10 -> ${result.metrics.readabilityScoreAfter}/10

## Executive Summary
${result.summary}

## Key Highlights
${result.keyHighlights.map((k) => `- ${k}`).join('\n')}

## Detailed Explanations
${result.explanations
  .map(
    (e, i) => `### ${i + 1}. ${e.title} (${e.category.toUpperCase()} - ${e.impact.toUpperCase()} IMPACT)
- **Problem**: ${e.problem}
- **Solution**: ${e.solution}
- **Deep Dive**: ${e.technicalDeepDive}`
  )
  .join('\n\n')}

## Optimized Code
\`\`\`${result.language.toLowerCase()}
${result.optimizedCode}
\`\`\`

## Benchmarking & Testing Tips
${result.benchmarksAndTestingTips.map((b) => `- ${b}`).join('\n')}

## Trade-offs & Caveats
${result.tradeoffsOrCaveats.map((t) => `- ${t}`).join('\n')}
`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Key Highlights */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col">
        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Key Transformations</span>
        </div>
        <ul className="space-y-2.5 flex-1">
          {result.keyHighlights.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Benchmarking Tips */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col">
        <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Benchmarking & Verification</span>
        </div>
        <ul className="space-y-2.5 flex-1">
          {result.benchmarksAndTestingTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Trade-offs & Caveats + Export Report CTA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-white mb-3">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Trade-offs & Considerations</span>
          </div>
          <ul className="space-y-2.5">
            {result.tradeoffsOrCaveats.map((caveat, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                <span>{caveat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800">
          <button
            id="copy-markdown-report-btn"
            onClick={handleCopyReport}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Markdown Report!</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Full Optimization Report (.md)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
