import React, { useState } from 'react';
import {
  Terminal,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  CheckCircle,
  Database,
  ArrowRight,
  Sparkles,
  Zap,
  Code2,
  KeyRound,
  Cpu,
  Fingerprint,
  BarChart3
} from 'lucide-react';
import { User, DbStatus } from '../types';
import { storeAuthSession } from '../utils/authUtils';

interface MacAuthGatewayProps {
  onAuthSuccess: (user: User, token: string) => void;
  dbStatus: DbStatus | null;
}

export const MacAuthGateway: React.FC<MacAuthGatewayProps> = ({
  onAuthSuccess,
  dbStatus,
}) => {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const endpoint = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const payload = mode === 'signup' ? { name, email, password } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      storeAuthSession(data.token, data.user);
      onAuthSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccount = () => {
    setName('macOS Developer');
    setEmail(`dev_${Math.random().toString(36).substring(2, 6)}@apple-silicon.local`);
    setPassword('developer123');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-mono relative overflow-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Background Terminal Grid Subtle Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      {/* macOS Top Menu Bar */}
      <div className="w-full max-w-4xl bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-t-2xl px-4 py-2 flex items-center justify-between text-xs text-slate-300 shadow-2xl">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold text-sm select-none"></span>
          <span className="font-bold text-white select-none">OptimizerOS</span>
          <span className="hidden sm:inline text-slate-400 select-none">Shell</span>
          <span className="hidden sm:inline text-slate-400 select-none">Kernel</span>
          <span className="hidden md:inline text-slate-400 select-none">Window</span>
          <span className="hidden md:inline text-slate-400 select-none">Help</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Kernel v14.2</span>
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Main macOS Terminal Window */}
      <div className="w-full max-w-4xl bg-slate-900 border-x border-b border-slate-800 rounded-b-2xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Terminal Titlebar with Traffic Lights */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 inline-block transition-opacity" />
              <span className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 inline-block transition-opacity" />
              <span className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 inline-block transition-opacity" />
            </div>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800 text-xs font-bold text-slate-200">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>terminal — login session (auth-gate: required)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
            bash 80x24 • UTF-8
          </div>
        </div>

        {/* Terminal ASCII Banner & Instructions */}
        <div className="p-6 sm:p-8 bg-slate-950/60 border-b border-slate-800/80 space-y-3">
          <div className="text-xs text-cyan-400 font-bold tracking-tight">
            ╔═══════════════════════════════════════════════════════════════════════════╗<br />
            ║ &nbsp;DEVELOPER ENVIRONMENT: CODE OPTIMIZER & AST BENCHMARK ENGINE &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;║<br />
            ║ &nbsp;STATUS: ACCOUNT REQUIRED TO INITIALIZE AST ENGINE & WORKSPACE &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;║<br />
            ╚═══════════════════════════════════════════════════════════════════════════╝
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">$</span>
              <span>Please create an account or sign in to start optimizing code.</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Access: <strong>Authenticated Developer</strong></span>
            </div>
          </div>
        </div>

        {/* Main Terminal Form Area */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-900/90">
          {/* Left Column: Feature Highlights */}
          <div className="md:col-span-5 space-y-4">
            <div className="space-y-1">
              <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Developer Workspace</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                macOS Notebook Optimizer
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Sub-second code compilation analysis, 6-focus Big-O matrix comparison, interactive bar chart benchmarks, and instant code export.
              </p>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Sub-second low latency AST optimization</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <BarChart3 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Interactive Recharts Focus Matrix</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Personal optimization history & diff inspector</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoAccount}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors underline underline-offset-4"
            >
              <Fingerprint className="w-3.5 h-3.5" />
              <span>Fill Quick Demo Credentials</span>
            </button>
          </div>

          {/* Right Column: Sign Up / Sign In Form */}
          <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-4">
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
              <button
                type="button"
                id="auth-signup-tab"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  mode === 'signup'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Create Account (Required)
              </button>
              <button
                type="button"
                id="auth-login-tab"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                  mode === 'login'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Sign In
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300 animate-in fade-in">
                [ERROR]: {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold block">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Developer"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold block">Developer Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="developer@macos.internal"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold block">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                {mode === 'signup' && (
                  <div className="text-[10px] text-slate-500">
                    Bcrypt encrypted hash • Min 6 characters
                  </div>
                )}
              </div>

              <button
                type="submit"
                id="submit-auth-btn"
                disabled={loading}
                className="w-full mt-3 py-2.5 px-4 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{mode === 'signup' ? 'Create Account & Initialize Shell' : 'Sign In & Launch Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Terminal Footer Status Bar */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">● ready</span>
            <span>press return to execute</span>
          </div>
          <div className="flex items-center gap-3">
            <span>zsh 5.9 (arm64-apple-darwin23)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
