import React from 'react';
import { 
  Shield, 
  Key, 
  LayoutDashboard, 
  Clock, 
  Terminal, 
  GitCompare, 
  RotateCcw, 
  Cloud, 
  Users, 
  Settings, 
  Sparkles,
  Home,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, pendingCount, engineStatus }) {
  const navItems = [
    { id: 'landing', label: 'Home / Overview', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'approvals', 
      label: 'Pending Approvals', 
      icon: Clock, 
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-500/50'
    },
    { 
      id: 'exploit-lab', 
      label: 'Exploit Lab', 
      icon: Terminal,
      highlight: true
    },
    { id: 'diffs', label: 'Policy Diffs', icon: GitCompare },
    { id: 'audit', label: 'Audit & Rollback', icon: RotateCcw },
    { id: 'systems', label: 'Connected Systems', icon: Cloud },
    { id: 'users', label: 'Users & Principals', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside 
      aria-label="Main Navigation"
      className="w-64 bg-slate-950/95 border-r border-emerald-500/25 flex flex-col justify-between h-screen fixed left-0 top-0 z-30 select-none backdrop-blur-xl"
    >
      {/* Brand & Hybrid Shield-Key Logo Mark */}
      <div>
        <div className="p-5 border-b border-emerald-500/20 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-3 group text-left focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg p-1"
            aria-label="TrueGrant AI Home"
          >
            {/* Hybrid Shield / Key Logo Mark */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <Shield className="w-6 h-6 text-emerald-400 fill-emerald-950/40" />
                <Key className="w-3.5 h-3.5 text-teal-300 absolute -bottom-0.5 -right-0.5 transform -rotate-45" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                  TrueGrant
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold bg-emerald-950 border border-emerald-400/60 text-emerald-300">
                  AI
                </span>
              </div>
              <p className="text-[11px] font-mono text-emerald-400/70 tracking-wider uppercase">
                Autonomous IAM
              </p>
            </div>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-210px)]" aria-label="Sidebar Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'approvals' && currentView === 'pending');

            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                  isActive 
                    ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.25)] font-semibold' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 hover:border-slate-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-emerald-900/60 text-emerald-300' 
                      : 'text-slate-500 group-hover:text-emerald-400 group-hover:bg-slate-900'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-wide">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== null && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${item.badgeColor || 'bg-slate-900 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}

                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Telemetry Badge */}
      <div className="p-4 border-t border-emerald-500/20 bg-slate-950/80">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Hackathon Track
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              Track 05
            </span>
          </div>
          <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Agents That Act</span>
          </p>
          <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
            <span>Isolation</span>
            <span className="font-mono text-teal-300 font-medium">eBPF Sandbox</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
