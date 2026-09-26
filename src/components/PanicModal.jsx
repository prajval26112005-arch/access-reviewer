import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertOctagon, CheckCircle2, X } from 'lucide-react';

export default function PanicModal({
  isOpen,
  onClose,
  onConfirmPanic,
  isRollingBack,
  countdown = 3
}) {
  if (!isOpen) return null;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="panic-dialog-title"
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-rose-500 p-8 shadow-[0_0_80px_rgba(239,68,68,0.5)] space-y-6 text-center overflow-hidden">
        
        {/* Pulsing Red Aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        {!isRollingBack && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cancel panic rollback"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Icon & Title */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-rose-950 border-2 border-rose-500 mx-auto flex items-center justify-center text-rose-400 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse">
            <AlertOctagon className="w-9 h-9" />
          </div>

          <h3 id="panic-dialog-title" className="text-2xl font-black text-white tracking-tight">
            EMERGENCY PANIC ROLLBACK
          </h3>

          <p className="text-xs text-rose-200 font-mono max-w-sm mx-auto leading-relaxed">
            Immediately restore all pre-revocation IAM policies from encrypted snapshots. TrueForge guarantees zero-downtime recovery within 3 seconds.
          </p>
        </div>

        {/* 3-Second Real Animated Countdown Display */}
        {isRollingBack ? (
          <div className="py-6 space-y-4">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-rose-500/20 animate-ping" />
              <div className="absolute inset-0 rounded-full border-4 border-rose-500 border-t-transparent animate-spin" />
              <span className="text-4xl font-black font-mono text-rose-400">
                {countdown}s
              </span>
            </div>
            <p className="text-xs font-mono text-emerald-300 animate-pulse font-semibold">
              Applying AES-256 snapshot across AWS IAM &amp; GitHub MCP...
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 text-left font-mono text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between text-rose-400 font-bold">
              <span>Action Scope: GLOBAL FAIL-SAFE</span>
              <span>SLA: 3,000ms</span>
            </div>
            <div className="text-[11px] text-slate-400">
              • Restores 42 role policies to baseline state<br />
              • Releases all active quarantine holds<br />
              • Generates signed SOC 2 emergency incident log
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!isRollingBack && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl text-xs font-mono font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={onConfirmPanic}
              className="px-7 py-3 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.6)] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              Confirm 3-Sec Rollback
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
