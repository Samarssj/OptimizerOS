import React, { useState } from 'react';
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Layers, 
  Terminal,
  Filter,
  Copy,
  Check
} from 'lucide-react';
import { OptimizationExplanation } from '../types';

interface ExplanationListProps {
  explanations: OptimizationExplanation[];
}

export const ExplanationList: React.FC<ExplanationListProps> = ({ explanations }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(explanations.map((e) => e.category.toLowerCase())))];

  const filteredExplanations = selectedCategory === 'all'
    ? explanations
    : explanations.filter((e) => e.category.toLowerCase() === selectedCategory);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const handleCopyExplanation = (exp: OptimizationExplanation, idx: number) => {
    const text = `**${exp.title}** (${exp.category.toUpperCase()} - ${exp.impact.toUpperCase()} IMPACT)
Problem: ${exp.problem}
Solution: ${exp.solution}
Technical Deep Dive: ${exp.technicalDeepDive}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getImpactBadge = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <Flame className="w-3 h-3 text-rose-400 fill-rose-400" />
            High Impact
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Medium Impact
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
            Low Impact
          </span>
        );
    }
  };

  const getCategoryBadge = (category: string) => {
    return (
      <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
        {category}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Header with Category Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Optimization Breakdown & Explanations
            </h2>
            <p className="text-xs text-slate-400">
              {explanations.length} key architectural & performance improvements explained
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 hidden sm:inline" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3.5">
        {filteredExplanations.map((exp, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className="bg-slate-950/70 border border-slate-800/90 rounded-xl overflow-hidden transition-all hover:border-slate-700/80"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center border border-slate-700">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100">
                      {exp.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {getCategoryBadge(exp.category)}
                    {getImpactBadge(exp.impact)}
                    <button
                      onClick={() => handleCopyExplanation(exp, idx)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors ml-1"
                      title="Copy explanation details to clipboard"
                    >
                      {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Problem & Solution Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                  {/* The Problem */}
                  <div className="bg-rose-950/20 border border-rose-900/30 rounded-lg p-3 sm:p-3.5 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>The Bottleneck</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {exp.problem}
                    </p>
                  </div>

                  {/* The Solution */}
                  <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-lg p-3 sm:p-3.5 flex flex-col">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>The Optimization</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {exp.solution}
                    </p>
                  </div>
                </div>

                {/* Technical Deep Dive Collapsible */}
                {exp.technicalDeepDive && (
                  <div className="pt-2 border-t border-slate-800/60 mt-1">
                    <button
                      onClick={() => toggleExpand(idx)}
                      className="flex items-center justify-between w-full text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        Under the Hood: Engine & CS Deep Dive
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3.5 rounded-lg bg-slate-900 border border-cyan-500/20 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans animate-fadeIn">
                        {exp.technicalDeepDive}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
