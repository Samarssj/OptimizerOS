import { SampleCode, OptimizationFocus } from '../types';

export const SAMPLE_CODES: SampleCode[] = [
  {
    id: 'js-nested-lookup',
    title: 'Nested Array Search & Deduplication',
    category: 'Algorithms & Data Structures',
    language: 'JavaScript',
    description: 'Quadratic O(N × M) nested loop checking array inclusions, causing severe lag on large lists.',
    focus: 'algorithmic',
    code: `// Finds matching transactions and filters out duplicates
function getMatchedTransactions(transactions, verifiedIds) {
  let result = [];
  
  for (let i = 0; i < transactions.length; i++) {
    let tx = transactions[i];
    let isVerified = false;
    
    // Inefficient nested linear scan O(M)
    for (let j = 0; j < verifiedIds.length; j++) {
      if (verifiedIds[j] === tx.id) {
        isVerified = true;
        break;
      }
    }
    
    if (isVerified) {
      // Inefficient duplicate check O(K)
      let alreadyAdded = false;
      for (let k = 0; k < result.length; k++) {
        if (result[k].id === tx.id) {
          alreadyAdded = true;
          break;
        }
      }
      
      if (!alreadyAdded) {
        result.push(tx);
      }
    }
  }
  
  return result;
}`
  },
  {
    id: 'py-string-concat',
    title: 'String Concatenation & File Parsing',
    category: 'Memory & Allocations',
    language: 'Python',
    description: 'Improper repeated string reallocation in loops causing quadratic memory churn.',
    focus: 'performance',
    code: `def process_server_logs(log_lines):
    # Generates a formatted summary text of critical errors
    formatted_report = ""
    error_count = 0
    unique_ips = []
    
    for line in log_lines:
        if "ERROR" in line or "CRITICAL" in line:
            parts = line.split(" ")
            timestamp = parts[0]
            ip_address = parts[1]
            message = " ".join(parts[2:])
            
            # Inefficient O(N) membership check on list
            if ip_address not in unique_ips:
                unique_ips.append(ip_address)
            
            error_count += 1
            # Inefficient string concatenation in loop: allocates new string object each iteration
            formatted_report += "[" + str(timestamp) + "] IP:" + ip_address + " -> " + message + "\\n"
            
    summary_header = "Total Errors: " + str(error_count) + "\\nUnique Attackers: " + str(len(unique_ips)) + "\\n---\\n"
    return summary_header + formatted_report`
  },
  {
    id: 'ts-memoization',
    title: 'Exponential Recursive Calculator',
    category: 'Dynamic Programming',
    language: 'TypeScript',
    description: 'O(2^N) exponential time complexity due to redundant re-computation of overlapping subproblems.',
    focus: 'algorithmic',
    code: `// Calculates nth Fibonacci or combinatorial risk weight
function calculateRiskFactor(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  
  // Repeated duplicate calculations on the recursive call tree
  return calculateRiskFactor(n - 1) + calculateRiskFactor(n - 2);
}

export function computeBatchRiskScores(userRiskLevels: number[]): number[] {
  const scores: number[] = [];
  for (let i = 0; i < userRiskLevels.length; i++) {
    // Recomputes the exact same expensive recursion for repeated risk levels
    scores.push(calculateRiskFactor(userRiskLevels[i]));
  }
  return scores;
}`
  },
  {
    id: 'cpp-vector-copy',
    title: 'Excessive Copies & Allocation',
    category: 'Memory & Cache Locality',
    language: 'C++',
    description: 'Passing heavy objects by value, missing reserve(), and cache-unfriendly vector reshuffling.',
    focus: 'memory',
    code: `#include <vector>
#include <string>
#include <algorithm>

struct DataRecord {
    std::string id;
    std::string payload;
    double score;
};

// Suboptimal: takes heavy vector by value (deep copy)
std::vector<DataRecord> filterAndRank(std::vector<DataRecord> records, double threshold) {
    std::vector<DataRecord> output;
    
    for (size_t i = 0; i < records.size(); i++) {
        // Missing output.reserve(), causing frequent reallocations and memory copies
        if (records[i].score >= threshold) {
            output.push_back(records[i]); // Full struct copy
        }
    }
    
    // Bubble sort or unoptimized sort without move semantics
    for (size_t i = 0; i < output.size(); i++) {
        for (size_t j = i + 1; j < output.size(); j++) {
            if (output[i].score < output[j].score) {
                DataRecord temp = output[i];
                output[i] = output[j];
                output[j] = temp;
            }
        }
    }
    
    return output;
}`
  },
  {
    id: 'sql-subquery-nplusone',
    title: 'Correlated Subquery & Missing Indices',
    category: 'Database Query Optimization',
    language: 'SQL',
    description: 'N+1 correlated subquery executing a table scan for every single customer record.',
    focus: 'performance',
    code: `SELECT 
    c.id AS customer_id,
    c.first_name,
    c.last_name,
    c.email,
    -- Correlated scalar subquery executed once for EVERY row in customers (O(N * M))
    (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS total_orders,
    (SELECT SUM(o.total_amount) FROM orders o WHERE o.customer_id = c.id) AS lifetime_value,
    (SELECT MAX(o.created_at) FROM orders o WHERE o.customer_id = c.id) AS last_order_date
FROM customers c
WHERE c.status = 'active'
  AND (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) > 0
ORDER BY (SELECT SUM(o.total_amount) FROM orders o WHERE o.customer_id = c.id) DESC;`
  }
];

export const SUPPORTED_LANGUAGES = [
  'Auto Detect',
  'JavaScript',
  'TypeScript',
  'Python',
  'C++',
  'Java',
  'Rust',
  'Go',
  'SQL',
  'C#',
  'PHP',
  'Ruby',
  'Kotlin',
  'Swift',
  'HTML / CSS',
  'Shell / Bash',
];

export const FOCUS_PRESETS: { id: OptimizationFocus; label: string; description: string; icon: string }[] = [
  {
    id: 'balanced',
    label: 'Balanced Optimization',
    description: 'Harmonious blend of high performance, clean architecture, and readability.',
    icon: 'Sparkles',
  },
  {
    id: 'performance',
    label: 'Maximum Speed & Throughput',
    description: 'Minimize execution time, CPU cycles, and latency.',
    icon: 'Zap',
  },
  {
    id: 'algorithmic',
    label: 'Big-O / Algorithmic',
    description: 'Reduce time complexity (e.g., O(N²) → O(N) or O(log N)).',
    icon: 'Binary',
  },
  {
    id: 'memory',
    label: 'Memory & Space Efficiency',
    description: 'Reduce allocations, garbage collection pressure, and memory footprint.',
    icon: 'Cpu',
  },
  {
    id: 'readability',
    label: 'Clean Code & Maintainability',
    description: 'Improve naming, modularity, type-safety, and idiomatic clarity.',
    icon: 'BookOpen',
  },
  {
    id: 'concurrency',
    label: 'Async & Concurrency',
    description: 'Leverage async/await, worker threads, parallel execution, and pipelining.',
    icon: 'Network',
  },
];
