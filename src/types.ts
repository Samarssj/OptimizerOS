export type OptimizationFocus =
  | 'balanced'
  | 'performance'
  | 'readability'
  | 'memory'
  | 'algorithmic'
  | 'concurrency';

export interface OptimizationMetrics {
  timeComplexityBefore: string;
  timeComplexityAfter: string;
  spaceComplexityBefore: string;
  spaceComplexityAfter: string;
  estimatedSpeedup: string;
  readabilityScoreBefore: number;
  readabilityScoreAfter: number;
}

export interface OptimizationExplanation {
  title: string;
  category: 'algorithmic' | 'memory' | 'readability' | 'concurrency' | 'caching' | 'io' | string;
  impact: 'high' | 'medium' | 'low';
  problem: string;
  solution: string;
  technicalDeepDive: string;
}

export interface OptimizationResult {
  id?: string;
  userId?: string;
  timestamp?: number;
  language: string;
  originalCode: string;
  focus: OptimizationFocus;
  summary: string;
  metrics: OptimizationMetrics;
  explanations: OptimizationExplanation[];
  optimizedCode: string;
  keyHighlights: string[];
  benchmarksAndTestingTips: string[];
  tradeoffsOrCaveats: string[];
  savedToDb?: boolean;
}

export interface SampleCode {
  id: string;
  title: string;
  category: string;
  language: string;
  description: string;
  code: string;
  focus: OptimizationFocus;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export interface DbStatus {
  connected: boolean;
  driver: string;
  error: string | null;
  database: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface QuizData {
  language: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface QuizScoreRecord {
  id: string;
  userId: string;
  language: string;
  score: number;
  total: number;
  percentage: number;
  timestamp: number;
}

export interface FocusBenchmarkData {
  focus: OptimizationFocus;
  name: string;
  speedupMultiplier: number;
  readabilityBefore: number;
  readabilityAfter: number;
  memoryReductionPercent: number;
  estimatedLatencyMs: number;
  throughputOpsSec: number;
  description: string;
  recommendedFor: string;
}

export interface BenchmarkScaleData {
  inputScale: string;
  baselineMs: number;
  optimizedMs: number;
  speedup: string;
}

export type RefactorPatternType =
  | 'loops-to-functional'
  | 'guard-clauses'
  | 'strategy-pattern'
  | 'builder-pipeline'
  | 'memoization'
  | 'immutability-pure'
  | 'factory-method'
  | 'custom';

export interface RefactorChange {
  title: string;
  explanation: string;
  beforeSnippet?: string;
  afterSnippet?: string;
}

export interface RefactorResult {
  id?: string;
  patternType: RefactorPatternType | string;
  patternName: string;
  category: string;
  summary: string;
  refactoredCode: string;
  originalCode: string;
  language: string;
  cognitiveComplexityBefore: number;
  cognitiveComplexityAfter: number;
  linesBefore: number;
  linesAfter: number;
  appliedChanges: RefactorChange[];
  benefits: string[];
  tradeoffs: string[];
  suggestedNextPatterns?: string[];
  timestamp?: number;
  modelUsed?: string;
}

export interface ModelStatus {
  activeModel: string;
  isDiscovered: boolean;
  availableModels: string[];
  fallbackOrder: string[];
}

