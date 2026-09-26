import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Terminal, 
  ArrowRight, 
  Flame, 
  RotateCcw,
  Sparkles,
  TrendingDown,
  Layers,
  ExternalLink
} from 'lucide-react';
import { FLAGGED_VS_RESOLVED_DATA } from '../data/seedData';
import CoreRequirementCards from './CoreRequirementCards';

// Helper component for animated count up (respects reduceMotion)
function AnimatedCountUp({ targetValue, duration = 1200, reduceMotion = false, suffix = '' }) {
  const [count, setCount] = useState(reduceMotion ? targetValue : 0);

  useEffect(() => {
    if (reduceMotion) {
      setCount(targetValue);
      return;
    }

    let start = 0;
    const end = parseInt(targetValue, 10) || 0;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalSteps = 30;
    const stepTime = Math.max(Math.floor(duration / totalSteps), 20);
    const stepValue = Math.max(Math.ceil(end / totalSteps), 1);

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue, duration, reduceMotion]);

  return <span>{count}{suffix}</span>;
}

export default function DashboardView({
  stats,
  flaggedKeys = [],
  agentFeed = [],
  onSelectKey,
  onOpenApprovals,
  onOpenAudit,
  onOpenExploitLab,
  onRunScan,
  isScanning,
  reduceMotion = false,
  setActiveTab,
  setCurrentView,
  onNavigate
}) {
  // Top 4 highest risk keys awaiting decision
  const highRiskKeys = flaggedKeys
    .filter(k => k.status === 'AWAITING_HUMAN_APPROVAL')
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4);

  return (
    <div className="space-y-8 py-2">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Security Posture Dashboard</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              Live Monitoring
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Continuous IAM boundary synthesis • Cross-referenced with CloudTrail &amp; eBPF Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRunScan}
            disabled={isScanning}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Zap className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : 'fill-current'}`} />
            <span>{isScanning ? 'Analyzing Boundaries...' : '⚡ Sweep Infrastructure'}</span>
          </button>
        </div>
      </div>

      {/* 1. Stat Cards (6 Animated Count-Up Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Stat 1: Keys Scanned */}
        <div className="glass-cyber-panel p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Keys Scanned</span>
            <Key className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              <AnimatedCountUp targetValue={stats.keysScanned || 248} reduceMotion={reduceMotion} />
            </span>
            <span className="text-[10px] text-emerald-400/80 block mt-0.5">Across AWS &amp; GitHub</span>
          </div>
        </div>

        {/* Stat 2: Stale Keys Found */}
        <div className="glass-cyber-panel p-4 rounded-xl border border-amber-500/35 bg-gradient-to-br from-amber-950/20 to-slate-900/60 flex flex-col justify-between hover:border-amber-400/60 transition-all hover:shadow-[0_0_25px_rgba(245,158,11,0.15)]">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Stale Keys (&gt;90d)</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300 tracking-tight">
              <AnimatedCountUp targetValue={stats.staleKeysFound || 14} reduceMotion={reduceMotion} />
            </span>
            <span className="text-[10px] text-amber-400/80 block mt-0.5">Unused credential risk</span>
          </div>
        </div>

        {/* Stat 3: Pending Approvals */}
        <button
          onClick={onOpenApprovals}
          className="glass-cyber-panel p-4 rounded-xl border border-rose-500/35 bg-gradient-to-br from-rose-950/20 to-slate-900/60 flex flex-col justify-between text-left hover:border-rose-400/60 transition-all hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] focus-visible:ring-2 focus-visible:ring-rose-400 group"
        >
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Pending Approvals</span>
            <Clock className="w-3.5 h-3.5 text-rose-400 group-hover:animate-pulse" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-300 tracking-tight">
              <AnimatedCountUp targetValue={stats.pendingApprovals || 8} reduceMotion={reduceMotion} />
            </span>
            <span className="text-[10px] text-rose-400/80 block mt-0.5 group-hover:underline">Halted by design →</span>
          </div>
        </button>

        {/* Stat 4: Attack Surface Reduced (%) */}
        <div className="glass-cyber-panel p-4 rounded-xl border border-teal-500/30 flex flex-col justify-between hover:border-teal-400/60 transition-all hover:shadow-[0_0_25px_rgba(45,212,191,0.15)]">
          <div className="flex items-center justify-between text-teal-300">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Surface Pruned</span>
            <TrendingDown className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-teal-300 tracking-tight">
              <AnimatedCountUp targetValue={stats.attackSurfaceReduced || 87} suffix="%" reduceMotion={reduceMotion} />
            </span>
            <span className="text-[10px] text-teal-400/80 block mt-0.5">Least-privilege gain</span>
          </div>
        </div>

        {/* Stat 5: Revocations Executed */}
        <div className="glass-cyber-panel p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between text-emerald-300">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Revocations Exec</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              <AnimatedCountUp targetValue={stats.revocationsExecuted || 42} reduceMotion={reduceMotion} />
            </span>
            <span className="text-[10px] text-emerald-400/80 block mt-0.5">Cryptographically signed</span>
          </div>
        </div>

        {/* Stat 6: Avg Key Age (days) */}
        <div className="glass-cyber-panel p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between hover:border-emerald-400/60 transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">Avg Key Age</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2.5">
            <span className="text-2xl sm:text-3xl font-black font-mono text-slate-200 tracking-tight">
              <AnimatedCountUp targetValue={stats.avgKeyAgeDays || 118} suffix="d" reduceMotion={reduceMotion} />
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">SLA threshold: 90d</span>
          </div>
        </div>

      </div>

      {/* 2. Core Hackathon Pillars & Fast Route Navigation (Requirements 01, 02, 03) */}
      <section aria-labelledby="core-pillars-title" className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 id="core-pillars-title" className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider">
              Core Agent Architecture &amp; Fast Navigation
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Click cards to navigate • WCAG 2.2 AAA Accessible
          </span>
        </div>
        <CoreRequirementCards 
          setActiveTab={setActiveTab}
          setCurrentView={setCurrentView}
          onNavigate={onNavigate}
        />
      </section>

      {/* 3. Middle Row: Flagged vs Resolved Area Chart + Awaiting Your Decision */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Flagged vs Resolved Chart (7 cols) */}
        <section aria-labelledby="chart-title" className="lg:col-span-7 glass-cyber-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="chart-title" className="text-base font-bold text-white flex items-center gap-2">
                <span>Flagged vs Resolved Risk (Last 30 Days)</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Continuous reduction of attack surface through human-verified revocations
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Flagged
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                Resolved
              </span>
            </div>
          </div>

          {/* Custom SVG Area / Bar Chart */}
          <div className="h-52 w-full pt-4">
            <div className="relative h-full w-full flex items-end justify-between gap-2 px-2 pb-6 border-b border-slate-800">
              {FLAGGED_VS_RESOLVED_DATA.map((item, idx) => {
                const maxVal = 45;
                const flaggedHeight = Math.round((item.flagged / maxVal) * 100);
                const resolvedHeight = Math.round((item.resolved / maxVal) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Flagged Bar */}
                      <div 
                        style={{ height: `${flaggedHeight}%` }}
                        className="w-1/2 max-w-[14px] bg-gradient-to-t from-amber-600/60 to-amber-400 rounded-t-sm transition-all group-hover:brightness-125"
                        title={`${item.day}: ${item.flagged} Flagged`}
                      />
                      {/* Resolved Bar */}
                      <div 
                        style={{ height: `${resolvedHeight}%` }}
                        className="w-1/2 max-w-[14px] bg-gradient-to-t from-emerald-600/60 to-emerald-400 rounded-t-sm transition-all group-hover:brightness-125"
                        title={`${item.day}: ${item.resolved} Resolved`}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-emerald-300 transition-colors">
                      {item.day.replace('Day ', 'D')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
            <span>Velocity: +4.2 revocations/week</span>
            <span className="text-emerald-400">Net Exposure Trend: -74%</span>
          </div>
        </section>

        {/* Right: Awaiting Your Decision Panel (5 cols) */}
        <section aria-labelledby="decision-title" className="lg:col-span-5 glass-cyber-panel p-6 rounded-2xl border border-rose-500/30 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 id="decision-title" className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Awaiting Your Decision</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-500/50">
                Top Priority
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Agent halted. Destructive action requires human review.
            </p>
          </div>

          {/* List of 3-4 High Risk Keys */}
          <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1">
            {highRiskKeys.map((keyItem) => (
              <div
                key={keyItem.id}
                onClick={() => onSelectKey(keyItem)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onSelectKey(keyItem); }}
                className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/20 hover:border-emerald-400/60 cursor-pointer transition-all hover:bg-slate-850 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] space-y-1.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-200 group-hover:text-emerald-300 transition-colors truncate max-w-[200px]">
                    {keyItem.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                      {keyItem.idleDays}d idle
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-500/50">
                      Risk {keyItem.riskScore}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 truncate flex items-center justify-between">
                  <span>{keyItem.owner}</span>
                  <span className="text-emerald-400 font-mono text-[10px] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    Review Diff <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onOpenApprovals}
            className="w-full py-2.5 rounded-xl text-xs font-bold font-mono bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-colors text-center block focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Open All Pending Approvals ({flaggedKeys.filter(k => k.status === 'AWAITING_HUMAN_APPROVAL').length}) →
          </button>
        </section>

      </div>

      {/* 3. Bottom Row: Live Agent Feed Mini-Widget */}
      <section aria-labelledby="feed-title" className="glass-terminal-panel p-5 rounded-2xl border border-emerald-500/30 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300 font-semibold">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span id="feed-title">Live Agent Feed &amp; eBPF Telemetry Stream</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Streaming
            </span>
            <button
              onClick={onOpenAudit}
              className="text-xs font-mono text-emerald-400 hover:text-emerald-300 underline flex items-center gap-1"
            >
              <span>View full activity</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Latest 3 terminal log lines */}
        <div className="space-y-1.5 font-mono text-xs">
          {agentFeed.slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-slate-300">
              <span className="text-slate-500 text-[11px] shrink-0">{item.time}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${
                item.level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-500/50' :
                item.level === 'WARN' ? 'bg-amber-950 text-amber-300 border border-amber-500/50' :
                item.level === 'HALT' ? 'bg-rose-950 text-rose-200 border border-rose-500/60 font-bold' :
                'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              }`}>
                {item.level}
              </span>
              <span className="text-slate-200 text-xs leading-relaxed">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
