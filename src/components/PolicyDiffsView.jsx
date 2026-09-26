import React, { useState } from 'react';
import { 
  GitCompare, 
  CheckCircle2, 
  Shield, 
  ArrowRight, 
  Key, 
  Layers, 
  Sparkles, 
  RotateCcw,
  Check,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function PolicyDiffsView({
  flaggedKeys = [],
  onSelectKeyForApproval
}) {
  const [selectedKeyId, setSelectedKeyId] = useState(flaggedKeys[0]?.id || 'key-001');

  const currentKey = flaggedKeys.find(k => k.id === selectedKeyId) || flaggedKeys[0];

  return (
    <div className="space-y-8 py-2">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>A Job Worth Handing Over • Automated Least-Privilege Synthesis</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Proposed Policy Diffs
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Turns a dangerous multi-week manual IAM audit into surgical least-privilege proposals a human can review in 30 seconds.
          </p>
        </div>

        {/* CloudTrail Verification Badge */}
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-400/50 flex items-center gap-2.5 text-xs text-emerald-200 font-mono shadow-[0_0_20px_rgba(52,211,153,0.2)]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Verified: 0 CloudTrail requests would fail across 90 days of traffic.</span>
        </div>
      </div>

      {/* Main Content: Left Column Selector, Right Column GitHub Diff View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 cols): Select Flagged Key/Role */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block font-semibold">
            Flagged Roles &amp; Keys ({flaggedKeys.length})
          </span>

          <div className="space-y-2 overflow-y-auto max-h-[600px] pr-1">
            {flaggedKeys.map((item) => {
              const isSelected = item.id === currentKey?.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedKeyId(item.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    isSelected
                      ? 'bg-emerald-950/80 border-emerald-400/70 shadow-[0_0_20px_rgba(52,211,153,0.25)]'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold truncate max-w-[200px] ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {item.name}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      item.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-500/50' :
                      item.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-500/50' :
                      'bg-slate-950 text-slate-400 border border-slate-700'
                    }`}>
                      {item.severity}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{item.system} • {item.idleDays}d idle</span>
                    <span className="text-emerald-400">{item.status.replace(/_/g, ' ')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column (8 cols): GitHub-Diff Style Diff Viewer */}
        <div className="lg:col-span-8 glass-terminal-panel rounded-2xl border border-emerald-500/30 overflow-hidden space-y-0">
          
          {/* Diff Header */}
          <div className="bg-slate-900/90 px-6 py-4 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  {currentKey?.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Principal: <code className="text-emerald-300">{currentKey?.keyId}</code> • Owner: {currentKey?.owner}
              </p>
            </div>

            <button
              onClick={() => onSelectKeyForApproval(currentKey)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <span>Review &amp; Approve Fix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Verification Badge */}
          <div className="px-6 py-2.5 bg-emerald-950/40 border-b border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {currentKey?.cloudTrailVerification || 'Replayed against 90 days of CloudTrail traffic — 0 requests would have failed'}
            </span>
            <span className="text-[10px] text-teal-300 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40">
              Zero Downtime Risk
            </span>
          </div>

          {/* GitHub-Diff Style Code Box */}
          <div className="p-6 bg-slate-950/95 font-mono text-xs leading-relaxed overflow-x-auto max-h-[500px]">
            {currentKey?.diffLines ? (
              currentKey.diffLines.map((line, idx) => {
                const isRemoved = line.type === 'removed';
                const isAdded = line.type === 'added';

                return (
                  <div 
                    key={idx} 
                    className={`flex items-center py-0.5 px-2 rounded-sm ${
                      isRemoved 
                        ? 'bg-rose-950/40 text-rose-300 border-l-2 border-rose-500 font-semibold' 
                        : isAdded 
                        ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-400 font-semibold' 
                        : 'text-slate-400'
                    }`}
                  >
                    <span className="w-6 shrink-0 text-slate-600 select-none text-[11px]">{idx + 1}</span>
                    <span className="w-4 shrink-0 font-bold select-none">
                      {isRemoved ? '-' : isAdded ? '+' : ' '}
                    </span>
                    <span className="whitespace-pre">{line.text}</span>
                  </div>
                );
              })
            ) : (
              <div className="space-y-1">
                <div className="text-rose-400 bg-rose-950/30 p-2 rounded border-l-2 border-rose-500">
                  - "Action": ["s3:*", "secretsmanager:GetSecretValue"]
                </div>
                <div className="text-emerald-300 bg-emerald-950/30 p-2 rounded border-l-2 border-emerald-400">
                  + "Action": ["s3:GetObject", "s3:ListBucket"]
                </div>
              </div>
            )}
          </div>

          {/* Diff Summary Footer */}
          <div className="px-6 py-3 bg-slate-900/90 border-t border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Removed 4 wildcard actions • Preserved required read dependencies</span>
            <span className="text-emerald-400 font-bold">Confidence: 99.4%</span>
          </div>

        </div>

      </div>

    </div>
  );
}
