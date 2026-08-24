import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Trophy, 
  BookOpen, 
  Code2, 
  Flame, 
  Check, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { QuizData, QuizQuestion, User } from '../types';
import { getSafeAuthHeaders } from '../utils/authUtils';

interface QuizViewProps {
  user: User | null;
}

const SUPPORTED_LANGUAGES = [
  'JavaScript / TypeScript',
  'Python',
  'C++',
  'Rust',
  'Go',
  'Java',
  'SQL',
  'C# / .NET',
];

export const QuizView: React.FC<QuizViewProps> = ({ user }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript / TypeScript');
  const [difficulty, setDifficulty] = useState<'intermediate' | 'advanced' | 'senior'>('intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);

  // Quiz progression state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleGenerateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    setQuizData(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: selectedLanguage,
          difficulty,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned ${response.status}`);
      }

      const data: QuizData = await response.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions returned from quiz generator. Please retry.');
      }

      setQuizData(data);
    } catch (err: any) {
      console.error('Quiz generation error:', err);
      setError(err.message || 'Failed to generate 10-question quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    let correct = 0;
    quizData.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleFinishQuiz = async () => {
    setIsSubmitted(true);

    if (quizData) {
      const score = calculateScore();
      // Record quiz submission
      try {
        await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: getSafeAuthHeaders(),
          body: JSON.stringify({
            language: quizData.language,
            score,
            total: quizData.questions.length,
            answers: userAnswers,
          }),
        });
      } catch (e) {
        console.warn('Failed to record score to database', e);
      }
    }
  };

  const currentQuestion = quizData?.questions[currentQuestionIndex];
  const score = quizData ? calculateScore() : 0;
  const totalQuestions = quizData?.questions.length || 10;
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6 font-mono">
      {/* Quiz Header & Selector Card */}
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
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>performance_quiz_assessment.sh — 10 Qs</span>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Algorithmic Benchmarking Mode</span>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    Algorithmic & Architecture Quiz
                  </h2>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    10 Challenges
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Targeted questions on Big-O complexity, CPU cache locality, memory allocators, and concurrency
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-6 space-y-1">
              <label className="text-xs font-medium text-slate-300">Target Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3 space-y-1">
              <label className="text-xs font-medium text-slate-300">Difficulty</label>
              <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              disabled={isLoading}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-cyan-500 capitalize"
            >
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="senior">Senior / Staff</option>
            </select>
          </div>

          <div className="sm:col-span-3 sm:pt-5">
            <button
              id="generate-quiz-btn"
              onClick={handleGenerateQuiz}
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating 10 Qs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 10 Questions</span>
                </>
              )}
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-xs sm:text-sm text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quiz Progress & Question Area */}
      {quizData && currentQuestion && (
        <div className="space-y-6">
          {/* Progress bar and Score Status */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-200">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {currentQuestion.category}
              </span>
            </div>

            {/* Stepper Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {quizData.questions.map((q, idx) => {
                const answered = userAnswers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                const isCorrect = isSubmitted && userAnswers[q.id] === q.correctIndex;
                const isIncorrect = isSubmitted && answered && userAnswers[q.id] !== q.correctIndex;

                let dotColor = 'bg-slate-800 text-slate-500';
                if (isSubmitted) {
                  if (isCorrect) dotColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
                  else if (isIncorrect) dotColor = 'bg-rose-500/20 text-rose-400 border-rose-500/40';
                } else if (isCurrent) {
                  dotColor = 'bg-amber-500/20 text-amber-400 border-amber-500/40';
                } else if (answered) {
                  dotColor = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold border transition-all flex items-center justify-center ${dotColor} ${
                      isCurrent ? 'ring-2 ring-amber-400/50' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {currentQuestion.question}
              </h3>

              {/* Code Snippet Box if available */}
              {currentQuestion.codeSnippet && (
                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Code Context:</span>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed whitespace-pre">
                    {currentQuestion.codeSnippet}
                  </pre>
                </div>
              )}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestion.id] === optIdx;
                const isCorrect = isSubmitted && optIdx === currentQuestion.correctIndex;
                const isWrongSelected = isSubmitted && isSelected && optIdx !== currentQuestion.correctIndex;

                let cardStyle = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200';

                if (isSubmitted) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-950/40 border-emerald-600 text-emerald-200 font-medium';
                  } else if (isWrongSelected) {
                    cardStyle = 'bg-rose-950/40 border-rose-600 text-rose-200';
                  } else {
                    cardStyle = 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/30';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${cardStyle}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                          : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </div>
                    <span className="text-xs sm:text-sm leading-relaxed flex-1">{option}</span>
                    {isSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    {isSubmitted && isWrongSelected && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submit */}
            {isSubmitted && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Lightbulb className="w-4 h-4" />
                  <span>Performance Engineering Explanation:</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Bottom Navigation / Submission bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-850 hover:bg-slate-800 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-2">
                {!isSubmitted ? (
                  currentQuestionIndex === totalQuestions - 1 || answeredCount === totalQuestions ? (
                    <button
                      onClick={handleFinishQuiz}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Submit & Score (10 Qs)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
                    >
                      <span>Next Question</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )
                ) : (
                  <button
                    onClick={handleGenerateQuiz}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-amber-300 hover:text-amber-200 bg-amber-950/50 border border-amber-800/60 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New 10 Questions</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Final Score Banner if Submitted */}
          {isSubmitted && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 text-center space-y-3 shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white">
                  Quiz Completed: {score} / {totalQuestions} Correct ({Math.round((score / totalQuestions) * 100)}%)
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  {score >= 8
                    ? 'Excellent performance intuition! You understand low-level algorithmic tradeoffs.'
                    : score >= 5
                    ? 'Good fundamentals! Review the explanations above to level up your optimization depth.'
                    : 'Keep practicing! Review compiler, memory, and complexity principles.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial Landing State before generator is clicked */}
      {!quizData && !isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-white">Test Your Code Optimization Mastery</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Pick your favorite language above and challenge yourself with 10 real-world algorithm, memory, and engine optimization questions generated on demand by Gemini.
            </p>
          </div>
          <button
            onClick={handleGenerateQuiz}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start 10-Question Quiz Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
