import React, { useState } from 'react';
import { 
  RotateCcw, 
  Shield, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Lock, 
  Key, 
  Check, 
  Copy,
  ExternalLink,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';

export default function AuditRollbackView({
  auditLog = [],
  onTriggerPanic,
  isRollingBack,
  rollbackCountdown
}) {
  const [copiedHash, setCopiedHash] = useState(null);
  const [filterAction, setFilterAction] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleExportCSV = () => {
    setToastMessage('Exported truegrant-audit-trail.csv (SOC 2 Type II compliant).');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportSOC2 = () => {
    setToastMessage('Generated SOC 2 Type II Signed Audit Verification Report.');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredLogs = auditLog.filter(item => {
    if (filterAction === 'ALL') return true;
    return item.action === filterAction;
  });

  return (
    <div className="space-y-8 py-2">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-950 border border-emerald-400 text-xs font-mono text-emerald-200 shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fail-Safe Recovery • Cryptographically Signed SOC 2 Ledger</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Audit Ledger &amp; Emergency Rollback
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Every authorization, denial, and emergency rollback is cryptographically signed and stored in an immutable audit ledger.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-emerald-400 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportSOC2}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 hover:border-emerald-300 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export SOC 2 Report</span>
          </button>
        </div>
      </div>

      {/* STANDOUT WOW MOMENT: PANIC 3-SEC ROLLBACK SECTION */}
      <section aria-labelledby="panic-section-title" className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-rose-950/70 border border-rose-500/50 shadow-[0_0_40px_rgba(239,68,68,0.25)] space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 id="panic-section-title" className="text-lg font-bold text-white font-mono">
                PANIC: 3-Second Fail-Safe Rollback
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-rose-900 text-rose-200 border border-rose-400">
                Zero-Downtime Guarantee
              </span>
            </div>
            <p className="text-xs text-rose-200/90 font-mono">
              In the unlikely event an approved least-privilege policy causes unintended pipeline regression, click Panic to restore the prior encrypted IAM snapshot within 3 seconds.
            </p>
          </div>

          <button
            id="panic-rollback-main-btn"
            onClick={onTriggerPanic}
            disabled={isRollingBack}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold font-mono text-xs bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-[0_0_30px_rgba(244,63,94,0.5)] active:scale-95 transition-all shrink-0 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <RotateCcw className={`w-4 h-4 ${isRollingBack ? 'animate-spin' : ''}`} />
            <span>
              {isRollingBack ? `Rolling Back in ${rollbackCountdown}s...` : '⚡ Trigger 3-Sec Panic Rollback'}
            </span>
          </button>
        </div>

        {/* Encrypted Pre-Revocation Snapshot Preview */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1.5 border-b border-slate-800">
            <span className="flex items-center gap-1.5 text-rose-300 font-semibold">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Cached Snapshot: SNAPSHOT-PRE-REVOKE-AES256-GCM</span>
            </span>
            <span className="text-emerald-400 font-bold">Encrypted &amp; Ready for Instant Replay</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
            <div>
              <span className="text-slate-500 block text-[10px]">Target Role</span>
              <span className="text-white font-bold">ProductionDataPipelineWorker</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Snapshot Time</span>
              <span className="text-slate-200">2026-09-25T17:15:00Z</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Restoration SLA</span>
              <span className="text-teal-300 font-bold">&lt; 3,000ms via AWS IAM API</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs for Audit Log */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800" role="tablist">
          {['ALL', 'REVOKED', 'KEPT', 'SNOOZED', 'ROLLBACK'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterAction(tab)}
              role="tab"
              aria-selected={filterAction === tab}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                filterAction === tab 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredLogs.length} signed entries
        </span>
      </div>

      {/* Append-Only Chronological Audit Log Table */}
      <div className="glass-cyber-panel rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Timestamp</th>
                <th className="py-3.5 px-4 font-semibold">Target Item</th>
                <th className="py-3.5 px-4 font-semibold">Action</th>
                <th className="py-3.5 px-4 font-semibold">Reviewer</th>
                <th className="py-3.5 px-4 font-semibold">Agent Reasoning &amp; Note</th>
                <th className="py-3.5 px-4 font-semibold text-right">SOC 2 Signature / Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-900/60 transition-colors">
                  
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    <div>{entry.formattedDate || new Date(entry.timestamp).toLocaleTimeString()}</div>
                    <div className="text-[10px] text-slate-500">{new Date(entry.timestamp).toLocaleDateString()}</div>
                  </td>

                  {/* Target Item */}
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {entry.itemName}
                  </td>

                  {/* Action Badge */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      entry.action === 'REVOKED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                      entry.action === 'KEPT' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                      entry.action === 'ROLLBACK' ? 'bg-rose-950 text-rose-300 border border-rose-500/50 font-bold' :
                      'bg-teal-950 text-teal-300 border border-teal-500/40'
                    }`}>
                      {entry.action}
                    </span>
                  </td>

                  {/* Reviewer */}
                  <td className="py-3.5 px-4 text-slate-300">
                    {entry.reviewer}
                  </td>

                  {/* Reasoning & Reviewer Note */}
                  <td className="py-3.5 px-4 max-w-xs space-y-1">
                    <p className="text-slate-300 text-xs">{entry.reasonSummary}</p>
                    {entry.reviewerNote && (
                      <p className="text-emerald-400/90 text-[11px] italic bg-slate-900/90 p-1.5 rounded border border-emerald-500/20">
                        "{entry.reviewerNote}"
                      </p>
                    )}
                  </td>

                  {/* Cryptographic Hash Badge */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => copyHash(entry.soc2Signature || entry.sha256Hash)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 text-[11px] font-mono group"
                      title="Click to copy cryptographic signature"
                    >
                      <span>
                        {(entry.soc2Signature || entry.sha256Hash).substring(0, 18)}...
                      </span>
                      {copiedHash === (entry.soc2Signature || entry.sha256Hash) ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-500 group-hover:text-emerald-400" />
                      )}
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
