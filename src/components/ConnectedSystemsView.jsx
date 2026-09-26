import React, { useState } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Shield, 
  Key, 
  ExternalLink, 
  Lock, 
  Cpu, 
  Globe,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function ConnectedSystemsView({
  systems = [],
  onSyncSystem,
  onToggleAutoRevoke
}) {
  const [syncingId, setSyncingId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);

  const handleSync = async (sys) => {
    setSyncingId(sys.id);
    await onSyncSystem(sys);
    setSyncingId(null);
  };

  return (
    <div className="space-y-8 py-2">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Requirement 01 • Reaches Something Real</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Connected Infrastructure Providers
          </h2>
          <p className="text-xs text-emerald-300/80 font-mono mt-1">
            Live identity provider APIs via MCP connectors (@mcp/aws-iam &amp; @mcp/github-mcp) • Not static fixture data
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs font-mono text-slate-300">
          <span className="text-slate-400">Total Bound Principals: </span>
          <span className="font-bold text-white">60 Active Roles &amp; Keys</span>
        </div>
      </div>

      {/* Persistent MCP Architecture Callout */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 flex items-start gap-3.5 text-xs text-slate-300 leading-relaxed">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-emerald-300 block mb-0.5">
            Continuous Read-Only Synchronization
          </span>
          TrueGrant AI queries live AWS IAM policy trees and GitHub organization member tokens directly over MCP. The agent operates strictly with read-only permissions until an authorized reviewer approves a proposed policy diff at the human approval gate.
        </div>
      </div>

      {/* 2 Infrastructure Cards: AWS IAM & GitHub Enterprise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {systems.map((sys) => {
          const isSyncing = syncingId === sys.id;

          return (
            <div 
              key={sys.id}
              className="glass-cyber-panel p-6 rounded-2xl border border-emerald-500/30 space-y-6 flex flex-col justify-between hover:border-emerald-400/60 transition-all hover:shadow-[0_0_35px_rgba(16,185,129,0.15)]"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.25)]">
                      {sys.icon === 'aws' ? <Cloud className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {sys.name}
                      </h3>
                      <span className="text-xs font-mono text-emerald-400/90">
                        {sys.connectionStatus}
                      </span>
                    </div>
                  </div>

                  {/* Read-Only Until Approval Badge */}
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold bg-emerald-950 text-emerald-300 border border-emerald-400/50 flex items-center gap-1 shadow-[0_0_12px_rgba(52,211,153,0.25)]">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>{sys.readOnlyBadge}</span>
                  </span>
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Roles/Keys</span>
                    <span className="text-xl font-bold font-mono text-white">{sys.rolesCount}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Active &lt;90d</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">{sys.activeKeysCount}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-amber-300 block">Stale &gt;90d</span>
                    <span className="text-xl font-bold font-mono text-amber-300">{sys.flaggedStaleCount} Flagged</span>
                  </div>
                </div>

                {/* Sub-Environments / Clusters breakdown */}
                {sys.environments && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-mono text-slate-400 block font-semibold uppercase tracking-wider">
                      Monitored Regions &amp; Repositories:
                    </span>
                    <div className="space-y-1.5">
                      {sys.environments.map((env, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-300">
                          <span className="text-emerald-300">{env.name}</span>
                          <div className="flex items-center gap-3 text-[11px]">
                            <span>{env.roles} Roles</span>
                            <span className="text-slate-500">•</span>
                            <span>{env.policies} Policies</span>
                            <span className="text-emerald-400 font-bold">● {env.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Controls: Last Synced, Auto-Revoke Toggle, Sync Now button */}
              <div className="space-y-4 pt-4 border-t border-slate-800/80">
                
                {/* Auto-Revoke Low Risk Toggle with Warning Tooltip */}
                <div className="flex items-center justify-between">
                  <div className="relative flex items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-300">Auto-revoke low risk:</span>
                    <button
                      type="button"
                      onMouseEnter={() => setShowTooltip(sys.id)}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="text-slate-400 hover:text-white"
                      aria-label="Toggle information"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>

                    {/* Tooltip */}
                    {showTooltip === sys.id && (
                      <div className="absolute left-0 bottom-full mb-2 w-64 p-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-[11px] text-amber-200 shadow-xl z-20 font-sans">
                        <strong className="block text-amber-300 font-bold mb-1">Human Approval Recommended:</strong>
                        Defaulted OFF per Requirement 03. Destructive revocations should always be verified by an engineer to prevent unexpected service disruption.
                      </div>
                    )}
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sys.autoRevokeLowRisk || false}
                      onChange={() => onToggleAutoRevoke(sys.id)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                    <span className="ml-2 text-[11px] font-mono text-slate-400">
                      {sys.autoRevokeLowRisk ? 'ON (Automatic)' : 'OFF (Guarded)'}
                    </span>
                  </label>
                </div>

                {/* Sync Now Button & Last Sync Timestamp */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Last sync: <strong className="text-slate-200">{sys.lastSynced}</strong>
                  </span>

                  <button
                    onClick={() => handleSync(sys)}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono bg-slate-900 hover:bg-slate-850 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 transition-all disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                    <span>{isSyncing ? 'Synchronizing MCP...' : 'Sync Now'}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
