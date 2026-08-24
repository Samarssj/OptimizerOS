# ⚡ AI Code Performance & Optimization Studio

<div align="center">

![GitHub Workflow Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=githubactions&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

<p align="center">
  <b>High-performance AI engine for automated code optimization, asymptotic complexity analysis, architectural refactoring, and interactive side-by-side diff verification.</b>
</p>

[Live Preview](https://ais-pre-carec2f2ogumkvexpxnv5t-170264886081.asia-southeast1.run.app) • [Architecture](#-system-architecture) • [Workflow](#-system-workflow) • [Key Features](#-features) • [Deployment](#-deployment-guide)

</div>

---

## 📖 Overview

**AI Code Performance & Optimization Studio** is a full-stack developer acceleration platform that analyzes arbitrary code snippets, uncovers asymptotic performance bottlenecks ($O(N^2) \to O(N)$), computes precise algorithmic time/space metrics, and generates complete, production-ready optimized implementations.

Developers can inspect line-by-line modifications via a synchronized side-by-side Diff Viewer, simulate execution scalability across large data bounds, and export patch files or comprehensive performance audit reports.

---

## ✨ Features

- **🚀 Algorithmic Optimization Engine:** Transforms brute-force algorithms, unoptimized nested loops, and memory-leaking routines into high-performance, idiomatic code.
- **📊 Algorithmic Profiling & Metrics:**
  - Before vs. After **Time Complexity** (e.g. $O(N^2) \to O(N \log N)$)
  - Before vs. After **Space Complexity** (e.g. $O(N) \to O(1)$)
  - Estimated **Execution Speedup Factor** & Readability Score ratings (1–10).
- **🔍 Interactive Side-by-Side Diff Viewer:**
  - Synchronized scrolling between original and optimized code.
  - Granular addition, deletion, and line modification tracking.
  - Dedicated **Split View**, **Unified View**, and **Optimized Only** layout modes.
  - One-click full-source clipboard copy and file downloading.
- **🛠️ Automated Architectural Refactor Studio:** Target custom architectural refactor patterns including:
  - *Clean Architecture & Modularization*
  - *Concurrency & Asynchronous Non-blocking Execution*
  - *Memory Allocation & Garbage Collection Reduction*
  - *Functional Paradigm Transformation*
- **📈 Multi-Scale Benchmark Simulation:** Simulates runtime latency comparisons across input scales from $N = 100$ to $N = 1,000,000$.
- **🧠 Interactive Coding & Optimization Quizzes:** Integrated knowledge assessment modules to test algorithmic concepts across Python, TypeScript, Java, C++, Go, and Rust.
- **📦 Multi-Format Export:** Instant export to `.patch` (Git unified diff), `.md` (Performance Audit Report), `.json` (Full Dataset), and raw source code files.
- **💾 Session & Cloud History:** Persistent tracking and instant retrieval of previous optimizations.

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|---|---|
| **Frontend UI** | ![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white) |
| **Icons & Syntax** | ![Lucide](https://img.shields.io/badge/Lucide-Icons-F05032?logo=lucide&logoColor=white) ![PrismJS](https://img.shields.io/badge/Prism.js-Syntax_Highlighting-2563EB) ![Diff](https://img.shields.io/badge/diff-Line_Level-emerald) |
| **Backend Service** | ![NodeJS](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white) ![TypeScript](https://img.shields.io/badge/TSX-Node_Engine-3178C6) |
| **AI Core** | ![Google Gemini](https://img.shields.io/badge/Google_GenAI-Gemini_3.7_Flash-8E75B2?logo=google&logoColor=white) |
| **Charts & Data** | ![Recharts](https://img.shields.io/badge/Recharts-Data_Viz-22C55E) ![D3](https://img.shields.io/badge/D3.js-Calculations-F9A03C?logo=d3dotjs&logoColor=white) |
| **Deployment** | ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white) ![Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Deployment-4285F4?logo=googlecloud&logoColor=white) |

</div>

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client (React 18 SPA)                         │
│                                                                         │
│   ┌─────────────────────┐  ┌────────────────────┐  ┌────────────────┐  │
│   │ Code Input & Preset │  │ Synchronized Diff  │  │ Complexity &   │  │
│   │ Language Selectors  │  │ & Syntax Viewer    │  │ Benchmark Viz  │  │
│   └──────────┬──────────┘  └──────────▲─────────┘  └───────▲────────┘  │
└──────────────┼────────────────────────┼────────────────────┼────────────┘
               │ JSON Payload           │ Full Source Code   │
               ▼                        │ & Metrics          │
┌────────────────────────────────────────────────────────────┴────────────┐
│                    API Gateway & Node.js / Express Server               │
│                                                                         │
│   ┌─────────────────────┐  ┌────────────────────┐  ┌────────────────┐  │
│   │ Auth & Session Guard│  │ Prompt Engineering │  │ Clean & Parse  │  │
│   │ getSafeAuthHeaders  │  │ & Schema Enforcer  │  │ JSON Pipeline  │  │
│   └──────────┬──────────┘  └──────────┬─────────┘  └───────▲────────┘  │
└──────────────┼────────────────────────┼────────────────────┼────────────┘
               │ Secure Internal Request│ Streaming Response │
               ▼                        ▼                    │
┌────────────────────────────────────────────────────────────┴────────────┐
│                 Google Gemini Generative AI Model Cluster               │
│                                                                         │
│     • gemini-3.7-flash (Primary Compiler Engine)                        │
│     • gemini-3.1-flash-lite / gemini-flash-latest (Dynamic Fallback)    │
│     • Strict Structured JSON Output Validation                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 System Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer
    participant UI as React UI (Diff & Studio)
    participant Svr as Express Server (/api/optimize)
    participant AI as Gemini GenAI Engine
    participant DB as Session History Storage

    Dev->>UI: Inputs unoptimized code & selects target language
    UI->>Svr: POST /api/optimize (Safe Bearer Auth Header)
    Svr->>AI: generateWithFallback(Structured Prompt + Schema)
    AI-->>Svr: Strict JSON (Complexity, Speedup, Full Optimized Code)
    Svr->>Svr: cleanAndParseJSON() & normalizeFullSourceCode()
    Svr->>DB: Record optimization event in persistent history
    Svr-->>UI: 200 OK (Optimized Code, Explanations, Metrics)
    UI->>UI: Compute AST diffLines & render synchronized view
    Dev->>UI: One-click "Copy Full Code" or "Export .patch"
```

---

## 🚀 Quickstart & Local Development

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm** or **yarn** or **pnpm**
- **Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-code-optimizer-studio.git
cd ai-code-optimizer-studio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
# Server Port (Defaults to 3000)
PORT=3000

# Google Gemini AI Secret Key (Server-side only)
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the application.

---

## 📦 Build & Production

To compile both client-side static assets and the self-contained server bundle:

```bash
npm run build
```

To start the production server:
```bash
npm run start
```

---

## 🐳 Docker & Cloud Deployment

### Build Docker Container
```bash
docker build -t ai-code-optimizer:latest .
```

### Run Docker Container
```bash
docker run -d -p 3000:3000 -e GEMINI_API_KEY="your_api_key" --name code-optimizer ai-code-optimizer:latest
```

### Deploy to Google Cloud Run
```bash
gcloud run deploy ai-code-optimizer \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_api_key"
```

---

## 🛡️ Security & Best Practices

- **Zero Client API Key Leaks:** The `GEMINI_API_KEY` is strictly accessed within server-side Express handlers and is never packaged in client-side bundles.
- **Sanitized Auth & Headers:** Requests utilize `getSafeAuthHeaders()` to prevent malformed bearer strings from causing unexpected token errors.
- **Safe Parsing Engine:** All AI responses pass through `cleanAndParseJSON` to strip rogue markdown formatting before state ingestion.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
