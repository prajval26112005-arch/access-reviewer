import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  RotateCcw, 
  RefreshCw, 
  Radio, 
  AlertOctagon, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Layers,
  X
} from 'lucide-react';

export default function TopBar({
  searchQuery,
  setSearchQuery,
  engineStatus,
  onRetryEngine,
  agentStatus,
  onTriggerPanic,
  notifications = [],
  onClearNotifications,
  setCurrentView
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const searchInputRef = useRef(null);
  const notifRef = useRef(null);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && showNotifications) {
        setShowNotifications(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showNotifications]);

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-slate-950/90 border-b border-emerald-500/25 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl">
      
      {/* Left: Global Search Box */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keys, roles, policies, owners, or CVEs... (Press '/' to focus)"
            aria-label="Search keys, roles, and policies"
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:border-emerald-400/80 transition-all shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-emerald-300 border border-slate-700">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Controls: Engine Status, Agent Status, Bell, Panic Rollback */}
      <div className="flex items-center gap-3">
        
        {/* 1. Engine Connection Status Pill */}
        {engineStatus?.online ? (
          <div 
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.25)]"
            title={`Backend connected at ${engineStatus.latencyMs ? `${engineStatus.latencyMs}ms` : '<100ms'}`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-semibold">TrueForge Engine Active</span>
            <span className="text-[10px] text-emerald-400/70 font-mono">
              {engineStatus.latencyMs ? `${engineStatus.latencyMs}ms` : ':3000'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-rose-950/80 border border-rose-500/50 text-rose-300"
              title="Backend unavailable, operating seamlessly on seeded mock data"
            >
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="font-semibold">Engine Offline — cached data</span>
            </div>
            <button
              onClick={onRetryEngine}
              aria-label="Retry backend connection"
              title="Retry connecting to TrueForge backend on port 3000"
              className="p-1.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2. Live AGENT STATUS Pill */}
        <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border bg-slate-900/90 text-slate-200 border-slate-700">
          <span className={`w-2 h-2 rounded-full ${
            agentStatus === 'SCANNING' 
              ? 'bg-sky-400 animate-ping' 
              : agentStatus === 'AWAITING_APPROVAL' 
              ? 'bg-amber-400 animate-pulse' 
              : 'bg-emerald-400'
          }`} />
          <span className="text-slate-400 uppercase text-[10px] font-bold">AGENT:</span>
          <span className="font-bold text-white">
            {agentStatus === 'SCANNING' && 'Scanning Infrastructure...'}
            {agentStatus === 'AWAITING_APPROVAL' && 'Awaiting Human Approval'}
            {agentStatus === 'IDLE' && 'Idle & Continuous eBPF'}
            {!['SCANNING', 'AWAITING_APPROVAL', 'IDLE'].includes(agentStatus) && agentStatus}
          </span>
        </div>

        {/* 3. Notification Bell with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="View notifications"
            aria-expanded={showNotifications}
            className="relative p-2 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-slate-300 hover:text-white hover:border-emerald-400 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-mono font-bold text-white flex items-center justify-center shadow-[0_0_8px_rgba(244,63,94,0.8)]">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Dropdown Panel */}
          {showNotifications && (
            <div 
              role="dialog"
              aria-label="Notifications"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl p-4 space-y-3 z-50 text-xs"
            >
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white text-sm">Security Alerts &amp; Slack Sync</span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                  aria-label="Close notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No unread security alerts.</p>
                ) : (
                  notifications.map((notif, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-1 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300 font-mono text-[11px]">{notif.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{notif.time || 'Just now'}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{notif.message}</p>
                      {notif.channel && (
                        <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-teal-400">Channel: {notif.channel}</span>
                          <span className="text-amber-400 font-semibold">{notif.status}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                <button
                  onClick={() => {
                    setCurrentView('settings');
                    setShowNotifications(false);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline flex items-center gap-1"
                >
                  Configure Channels (Slack/Webhook)
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearNotifications}
                    className="text-[11px] text-slate-400 hover:text-white font-mono"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. ALWAYS-VISIBLE RED PANIC ROLLBACK BUTTON */}
        <button
          id="panic-rollback-header-btn"
          onClick={onTriggerPanic}
          aria-label="Emergency Panic 3-second Rollback"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white border border-rose-400/50 shadow-[0_0_20px_rgba(239,68,68,0.35)] hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          <RotateCcw className="w-3.5 h-3.5 animate-spin-reverse" />
          <span>PANIC ROLLBACK</span>
        </button>

      </div>
    </header>
  );
}
