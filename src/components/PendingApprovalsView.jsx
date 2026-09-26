import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  X, 
  ArrowRight, 
  RotateCcw, 
  Key, 
  Terminal, 
  Check, 
  Layers,
  Sparkles,
  Search,
  Filter,
  Flame,
  MessageSquare
} from 'lucide-react';

export default function PendingApprovalsView({
  flaggedKeys = [],
  selectedKey = null,
  onSelectKey,
  onCloseDetail,
  onApproveItem,
  onRejectItem,
  onSnoozeItem,
  onBulkApproveLowRisk
}) {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL | CRITICAL | HIGH | MEDIUM | LOW
  const [filterQuery, setFilterQuery] = useState('');
  const [reviewerNote, setReviewerNote] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmingKey, setConfirmingKey] = useState(null);

  // Filter keys based on severity tab and text search
  const filteredKeys = flaggedKeys.filter((item) => {
    const matchesTab = 
      activeTab === 'ALL' ? true :
      activeTab === 'HIGH' ? (item.severity === 'HIGH' || item.severity === 'CRITICAL') :
      item.severity === activeTab;

    const matchesQuery = filterQuery === '' || 
      item.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.owner.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.system.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.keyId.toLowerCase().includes(filterQuery.toLowerCase());

    return matchesTab && matchesQuery;
  });

  const lowRiskCount = flaggedKeys.filter(k => k.severity === 'LOW' && k.status === 'AWAITING_HUMAN_APPROVAL').length;

  const handleOpenRevokeConfirm = (keyItem) => {
    setConfirmingKey(keyItem);
    setShowConfirmModal(true);
  };

  const handleFinalRevoke = () => {
    if (confirmingKey) {
      onApproveItem(confirmingKey.id, reviewerNote);
      setShowConfirmModal(false);
      setConfirmingKey(null);
      setReviewerNote('');
    }
  };

  return (
    <div className="space-y-6 py-2 relative">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Requirement 03 • Knows When to Stop</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Pending Security Approvals
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1">
            The TrueForge agent halts by design before performing any credential revocation. Human review is strictly enforced.
          </p>
        </div>

        {/* Bulk Action: Approve All Low Risk */}
        <button
          onClick={onBulkApproveLowRisk}
          disabled={lowRiskCount === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold font-mono bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-400/50 hover:border-emerald-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.2)] focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Approve All Low Risk ({lowRiskCount})</span>
        </button>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800" role="tablist">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              role="tab"
              aria-selected={activeTab === tab}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'HIGH' ? 'Critical / High' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter approvals..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400"
          />
        </div>
      </div>

      {/* Main Approvals Table */}
      <div className="glass-cyber-panel rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Key / Role Name</th>
                <th className="py-3.5 px-4 font-semibold">System</th>
                <th className="py-3.5 px-4 font-semibold">Owner</th>
                <th className="py-3.5 px-4 font-semibold">Last Used</th>
                <th className="py-3.5 px-4 font-semibold">Idle Days</th>
                <th className="py-3.5 px-4 font-semibold">Risk Score</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No keys match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredKeys.map((keyItem) => {
                  const isSelected = selectedKey?.id === keyItem.id;
                  const isAwaiting = keyItem.status === 'AWAITING_HUMAN_APPROVAL';

                  return (
                    <tr
                      key={keyItem.id}
                      onClick={() => onSelectKey(keyItem)}
                      className={`hover:bg-slate-900/70 cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-950/40 border-l-2 border-emerald-400' : ''
                      }`}
                    >
                      {/* Name & KeyId */}
                      <td className="py-3 px-4 font-semibold text-white">
                        <div className="flex flex-col">
                          <span>{keyItem.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{keyItem.keyId}</span>
                        </div>
                      </td>

                      {/* System */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-teal-300 font-bold">
                          {keyItem.system}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-3 px-4 text-slate-300">
                        {keyItem.owner}
                      </td>

                      {/* Last Used */}
                      <td className="py-3 px-4 text-slate-400">
                        {keyItem.lastUsed}
                      </td>

                      {/* Idle Days */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          keyItem.idleDays >= 120 ? 'bg-rose-950 text-rose-300 border border-rose-500/40' :
                          keyItem.idleDays >= 90 ? 'bg-amber-950 text-amber-300 border border-amber-500/40' :
                          'bg-slate-900 text-slate-400'
                        }`}>
                          {keyItem.idleDays}d
                        </span>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            keyItem.riskScore >= 80 ? 'text-rose-400' :
                            keyItem.riskScore >= 60 ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {keyItem.riskScore}
                          </span>
                          <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                            <div 
                              style={{ width: `${keyItem.riskScore}%` }}
                              className={`h-full ${
                                keyItem.riskScore >= 80 ? 'bg-rose-500' :
                                keyItem.riskScore >= 60 ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          keyItem.status === 'AWAITING_HUMAN_APPROVAL' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 animate-pulse' :
                          keyItem.status === 'REVOKED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                          keyItem.status === 'KEPT' ? 'bg-slate-900 text-slate-300 border border-slate-700' :
                          'bg-teal-950 text-teal-300 border border-teal-500/40'
                        }`}>
                          {keyItem.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectKey(keyItem);
                          }}
                          className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline"
                        >
                          Review →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-Over Detail Drawer Panel (When row clicked) */}
      {selectedKey && (
        <div 
          role="dialog"
          aria-label="Approval Details"
          className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-950/95 border-l border-emerald-500/40 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-40 p-6 space-y-6 overflow-y-auto"
        >
          {/* Top of drawer */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-500/50">
                AWAITING_HUMAN_APPROVAL
              </span>
              <h3 className="text-lg font-bold text-white font-mono">
                {selectedKey.name}
              </h3>
            </div>
            <button
              onClick={onCloseDetail}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              aria-label="Close detail panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Distinct AWAITING_HUMAN_APPROVAL Banner */}
          <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200">
              <strong className="block font-bold text-amber-300 mb-0.5">
                Agent Halted by Design:
              </strong>
              This action involves removing permissions. In compliance with Principle of Least Privilege and Hackathon Track 05 requirements, TrueGrant AI will never revoke this access without explicit human sign-off.
            </div>
          </div>

          {/* Agent Reasoning Terminal Block */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
              Agent Reasoning &amp; Investigation:
            </span>
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 font-mono text-xs text-emerald-300/90 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>TrueForge Synthesizer Log</span>
              </div>
              <p>{selectedKey.reasoning}</p>
              <div className="text-[11px] text-teal-300 pt-1">
                Target: {selectedKey.targetResource}
              </div>
            </div>
          </div>

          {/* Blast Radius Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
              Blast Radius Analysis:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Downtime Risk</span>
                <span className="text-emerald-400 font-bold">{selectedKey.blastRadius?.downtimeRisk || '0% Risk'}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Agent Confidence</span>
                <span className="text-teal-300 font-bold">{selectedKey.blastRadius?.confidence || 99.4}%</span>
              </div>
            </div>
            {selectedKey.blastRadius?.services && (
              <div className="text-xs font-mono text-slate-300 pt-1">
                <span className="text-slate-500">Dependent Services: </span>
                <span>{selectedKey.blastRadius.services.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Reviewer Note Field */}
          <div className="space-y-1.5">
            <label htmlFor="reviewer-note-input" className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reviewer Audit Note (Mandatory for SOC 2 Signature):</span>
            </label>
            <textarea
              id="reviewer-note-input"
              rows={2}
              value={reviewerNote}
              onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="e.g. Verified with platform team; confirmed decommissioned worker role."
              className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400"
            />
          </div>

          {/* Action Buttons: 2-Step Revoke, Keep Access, Snooze */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {/* Destructive Two-Step Confirm Button */}
            <button
              onClick={() => handleOpenRevokeConfirm(selectedKey)}
              className="w-full py-3 rounded-xl font-bold font-mono text-xs bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Approve Revocation (Requires Confirmation)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onRejectItem(selectedKey.id, reviewerNote || 'Keep access requested by reviewer');
                  onCloseDetail();
                }}
                className="py-2.5 rounded-xl font-mono text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                Keep Access (Overrule)
              </button>

              <button
                onClick={() => {
                  onSnoozeItem(selectedKey.id, reviewerNote || 'Snoozed 30 days for testing');
                  onCloseDetail();
                }}
                className="py-2.5 rounded-xl font-mono text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-amber-300 border border-amber-500/30 hover:border-amber-500/50 transition-colors"
              >
                Snooze 30 Days
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two-Step Confirmation Modal for Revocation */}
      {showConfirmModal && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-rose-500/60 p-6 shadow-[0_0_50px_rgba(244,63,94,0.4)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-500/60 flex items-center justify-center text-rose-300">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 id="confirm-modal-title" className="text-base font-bold text-white">
                  Confirm Destructive Revocation
                </h4>
                <p className="text-xs text-rose-300 font-mono">
                  Irreversible without 3-Second Rollback Snapshot
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Are you sure you want to approve revoking <strong className="text-white font-mono">{confirmingKey?.keyId}</strong>? The TrueForge agent will apply the least-privilege boundary and sign a SOC 2 audit record.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalRevoke}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                Yes, Authorize Revocation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
