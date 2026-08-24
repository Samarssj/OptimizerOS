# ⚡ AI Code Performance & Optimization Studio

<div align="center">

![GitHub Workflow Status](https://img.shields.io/badge/Build-Passing-emerald?style=for-the-badge&logo=githubactions&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deploy_Ready-black?style=for-the-badge&logo=render&logoColor=46E3B7)

<p align="center">
  <b>Full-stack AI developer platform for automated code optimization, asymptotic complexity analysis, design pattern refactoring, persistent user accounts (MongoDB Atlas), and interactive side-by-side diff verification.</b>
</p>

[Architecture](#-system-architecture) • [Workflow](#-system-workflow) • [Key Features](#-features) • [Deploy on Render](#-deploy-to-render) • [MongoDB Setup](#-mongodb-atlas-configuration)

</div>

---

## 📖 Overview

**AI Code Performance & Optimization Studio** is a production-ready full-stack developer acceleration platform. It analyzes code snippets, detects asymptotic complexity bottlenecks ($O(N^2) \to O(N)$), benchmarks multi-scale execution time, and provides full, runnable optimized implementations.

User accounts, sessions, and past optimizations are permanently persisted to **MongoDB Atlas** (with an automatic in-memory fallback for local prototyping).

---

## ✨ Features

- **🚀 Algorithmic Optimization Engine:** Transforms brute-force algorithms, unoptimized nested loops, and memory-leaking routines into high-performance, idiomatic code.
- **📊 Algorithmic Profiling & Metrics:**
  - Before vs. After **Time Complexity** (e.g. $O(N^2) \to O(N \log N)$)
  - Before vs. After **Space Complexity** (e.g. $O(N) \to O(1)$)
  - Estimated **Execution Speedup Factor** & Readability Score ratings (1–10).
- **🔒 Persistent User Accounts & Authentication:**
  - Secure bcrypt password hashing and signed JWT sessions.
  - Multi-user data isolation and history tracking with **MongoDB Atlas**.
- **🔍 Interactive Side-by-Side Diff Viewer:**
  - Synchronized scrolling between original and optimized code.
  - Granular addition, deletion, and line modification tracking.
  - Dedicated **Split View**, **Unified View**, and **Optimized Only** layout modes.
  - One-click full-source clipboard copy and file downloading.
- **🛠️ Automated Architectural Refactor Studio:** Target custom architectural refactor patterns including:
  - *Loops to Declarative Functional Pipelines*
  - *Guard Clauses & Early Returns*
  - *Strategy Pattern & Dispatch Tables*
  - *Builder & Fluent Pipelines*
  - *Memoization & Caching*
  - *Immutability & Pure Functions*
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
| **Backend & DB** | ![NodeJS](https://img.shields.io/badge/Node.js-20.x-339933?logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_M0-47A248?logo=mongodb&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtokens) |
| **AI Core** | ![Google Gemini](https://img.shields.io/badge/Google_GenAI-Gemini_3.7_Flash-8E75B2?logo=google&logoColor=white) |
| **Charts & Data** | ![Recharts](https://img.shields.io/badge/Recharts-Data_Viz-22C55E) ![D3](https://img.shields.io/badge/D3.js-Calculations-F9A03C?logo=d3dotjs&logoColor=white) |
| **Hosting** | ![Render](https://img.shields.io/badge/Render-Web_Service-black?logo=render&logoColor=46E3B7) |

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
│   │ JWT Bearer Verify   │  │ & Schema Enforcer  │  │ JSON Pipeline  │  │
│   └──────────┬──────────┘  └──────────┬─────────┘  └───────▲────────┘  │
└──────────────┼────────────────────────┼────────────────────┼────────────┘
               │ Secure Gemini Request  │ Structured Output  │
               ▼                        ▼                    │
┌───────────────────────────────┐     ┌──────────────────────────────────┐
│   Google Gemini AI Cluster    │     │      MongoDB Atlas Database      │
│                               │     │                                  │
│ • gemini-3.7-flash (Primary)  │     │ • users (auth & bcrypt hashes)   │
│ • Dynamic Fallback Resolvers  │     │ • history (optimizations & diff) │
│ • Structured JSON Generation  │     │ • quiz_scores (assessments)      │
└───────────────────────────────┘     └──────────────────────────────────┘
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
    participant DB as MongoDB Atlas

    Dev->>UI: Inputs code & clicks "Optimize Code"
    UI->>Svr: POST /api/optimize (Bearer JWT Auth)
    Svr->>AI: generateWithFallback(System Instruction + Schema)
    AI-->>Svr: Strict JSON (Complexity, Metrics, Full Optimized Code)
    Svr->>Svr: cleanAndParseJSON() & normalizeFullSourceCode()
    Svr->>DB: db.collection('history').insertOne(optimizationRecord)
    Svr-->>UI: 200 OK (Optimized Code, Explanations, Metrics, historyId)
    UI->>UI: Compute AST diffLines & render synchronized split view
    Dev->>UI: One-click "Copy Full Code" or "Export .patch"
```

---

## 🍃 MongoDB Atlas Configuration

1. Create a free **M0 Cluster** at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Under **Security > Database Access**, create a database user and password.
3. Under **Security > Network Access**, click **Add IP Address** $\to$ **Allow Access from Anywhere (`0.0.0.0/0`)** (required for cloud hosting like Render).
4. Under **Clusters > Connect > Drivers**, copy the connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/code_optimizer?retryWrites=true&w=majority
   MONGODB_DB_NAME=code_optimizer
   ```
   The app uses the `code_optimizer` database by default. If the URI does not include a database name, set `MONGODB_DB_NAME` explicitly in Render. The database user must have read/write access to this database.

---

## 🚀 Deploy to Render

### Option 1: 1-Click Blueprint (Using `render.yaml`)

1. Push your repository to **GitHub**.
2. Go to [Render Dashboard](https://dashboard.render.com/) $\to$ Click **New +** $\to$ **Blueprint**.
3. Connect your repository.
4. Set your `GEMINI_API_KEY` and `MONGODB_URI` environment variables and click **Apply**.

---

### Option 2: Manual Web Service Setup

1. In [Render Dashboard](https://dashboard.render.com/), click **New +** $\to$ **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Language:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Plan:** `Free`
4. Add the following **Environment Variables**:

| Key | Value | Description |
|---|---|---|
| `GEMINI_API_KEY` | `your_gemini_api_key` | Secret key from [Google AI Studio](https://aistudio.google.com/) |
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas cluster connection string |
| `MONGODB_DB_NAME` | `code_optimizer` | Optional database name; defaults to `code_optimizer` |
| `JWT_SECRET` | `a_secure_random_string` | Secret for signing user authentication tokens |
| `NODE_ENV` | `production` | Enables production bundle and static serving |

5. Click **Create Web Service**. Your app will build and go live on your Render URL!

---

## 💻 Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Setup `.env` file
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/code_optimizer?retryWrites=true&w=majority
JWT_SECRET=your_local_jwt_secret
```

### 3. Run development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🛡️ Security & Best Practices

- **Zero Client Key Leaks:** `GEMINI_API_KEY` and `MONGODB_URI` are server-only secrets and are never exposed in browser JavaScript bundles.
- **Bcrypt Password Security:** User passwords are never saved in plaintext; passwords are salted and hashed with 10 salt rounds.
- **Development Fallback:** When running locally without `MONGODB_URI`, the app may use in-memory storage for development. In production, or whenever `MONGODB_URI` is configured, signup and login fail clearly if MongoDB is unavailable or a user cannot be persisted; the app never reports a non-persisted account as a successful Atlas account.

---

## 📄 License

Distributed under the **MIT License**.

