import React from 'react';
import { 
  Shield, 
  Key, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  Zap, 
  Lock, 
  Cpu, 
  RotateCcw, 
  Sparkles,
  Server,
  AlertTriangle,
  Layers
} from 'lucide-react';
import CoreRequirementCards from './CoreRequirementCards';

export default function LandingPage({ 
  onOpenDashboard, 
  onSeeExploitProof, 
  onRunScan, 
  isScanning,
  setActiveTab,
  setCurrentView,
  onNavigate
}) {
  return (
    <div className="space-y-12 py-4">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-cyber-panel p-8 sm:p-12 border border-emerald-500/40 text-center space-y-8">
        
        {/* Ambient background glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Track 05: Agents That Act • Autonomous Cloud Security Engine</span>
        </div>

        {/* Main Hero Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            It finds the keys nobody remembers. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
              It proves the danger.
            </span> <br className="hidden sm:inline" />
            You approve the fix.
          </h1>

          <p className="text-base sm:text-lg text-emerald-200/80 max-w-2xl mx-auto font-sans leading-relaxed">
            TrueGrant AI continuously sweeps stale IAM and API credentials across your cloud infrastructure via MCP, proves multi-step lateral exploitability inside an isolated eBPF sandbox, proposes least-privilege policy diffs, and strictly halts for human authorization before touching any production permission.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenDashboard}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.4)] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSeeExploitProof}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>See a Live Exploit Proof</span>
          </button>

          <button
            onClick={onRunScan}
            disabled={isScanning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-mono text-xs font-bold bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-400/40 hover:border-emerald-300 transition-all disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : 'text-amber-400'}`} />
            <span>{isScanning ? 'Probing MCP Connectors...' : '⚡ Scan Live Systems'}</span>
          </button>
        </div>

      </section>

      {/* 2. Stats Strip */}
      <section aria-label="Key Security Metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            value: '142-day-old',
            label: 'keys found',
            sublabel: 'Dormant wildcard ingress flagged',
            accent: 'text-amber-400'
          },
          {
            value: '87%',
            label: 'attack surface reduction',
            sublabel: 'Unused wildcard actions pruned',
            accent: 'text-emerald-400'
          },
          {
            value: '0%',
            label: 'downtime risk',
            sublabel: 'Replayed against 90d CloudTrail',
            accent: 'text-teal-300'
          },
          {
            value: '3-second',
            label: 'rollback SLA',
            sublabel: 'Encrypted snapshot recovery',
            accent: 'text-rose-400'
          }
        ].map((stat, i) => (
          <div 
            key={i}
            className="glass-cyber-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col justify-between hover:border-emerald-400/50 transition-all shadow-[0_0_25px_rgba(16,185,129,0.08)]"
          >
            <div>
              <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${stat.accent}`}>
                {stat.value}
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {stat.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-3 pt-2 border-t border-slate-800">
              {stat.sublabel}
            </p>
          </div>
        ))}
      </section>

      {/* 3. Three Interactive Requirement Cards (The 3 Hackathon Core Pillars) */}
      <CoreRequirementCards 
        setActiveTab={setActiveTab}
        setCurrentView={setCurrentView}
        onNavigate={onNavigate}
      />


    </div>
  );
}
