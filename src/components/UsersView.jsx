import React, { useState } from 'react';
import { 
  Users, 
  Key, 
  Shield, 
  ExternalLink, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Cloud,
  Layers,
  Sparkles
} from 'lucide-react';

export default function UsersView({
  users = [],
  flaggedKeys = [],
  onSelectKey
}) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="space-y-8 py-2">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Identity Inventory • Cross-System Principal Mapping</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Users &amp; Service Principals
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Aggregated identities across AWS IAM and GitHub Enterprise. Click any principal to view active privileges.
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs font-mono text-slate-300">
          <span>Total Managed Principals: </span>
          <strong className="text-emerald-400 font-bold">{users.length} Identities</strong>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-cyber-panel rounded-2xl border border-emerald-500/30 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Name &amp; Role</th>
                <th className="py-3.5 px-4 font-semibold">Department / Team</th>
                <th className="py-3.5 px-4 font-semibold">Systems</th>
                <th className="py-3.5 px-4 font-semibold">Total Keys / Roles</th>
                <th className="py-3.5 px-4 font-semibold">Flagged Stale (&gt;90d)</th>
                <th className="py-3.5 px-4 font-semibold">Last Active</th>
                <th className="py-3.5 px-4 font-semibold text-right">Access Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {users.map((user) => {
                const hasCritical = user.flaggedCount > 0 && user.status.includes('Terminated');

                return (
                  <tr
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="hover:bg-slate-900/70 cursor-pointer transition-colors"
                  >
                    {/* Name & Avatar */}
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          hasCritical 
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/60' 
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {user.avatar}
                        </div>
                        <div>
                          <span className="block font-bold text-slate-100">{user.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Department / Team */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{user.department}</div>
                      <div className="text-[10px] text-slate-500">{user.role}</div>
                    </td>

                    {/* Systems */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {user.systems.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-700 text-teal-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Total Keys/Roles */}
                    <td className="py-3.5 px-4 text-slate-200">
                      {user.totalKeys} Active
                    </td>

                    {/* Flagged Count */}
                    <td className="py-3.5 px-4">
                      {user.flaggedCount > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 font-bold text-[11px]">
                          {user.flaggedCount} Flagged
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[11px]">
                          0 Compliant
                        </span>
                      )}
                    </td>

                    {/* Last Active */}
                    <td className="py-3.5 px-4 text-slate-400">
                      {user.lastActive}
                    </td>

                    {/* Profile Link */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Access Profile Modal / Drawer */}
      {selectedUser && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-profile-title"
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-400/50 flex items-center justify-center text-emerald-400 text-lg font-bold">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 id="user-profile-title" className="text-lg font-bold text-white font-mono flex items-center gap-2">
                    <span>{selectedUser.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                      {selectedUser.status}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {selectedUser.role} • {selectedUser.department}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close user profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Access Summary */}
            <div className="grid grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Connected Systems</span>
                <span className="text-teal-300 font-bold">{selectedUser.systems.join(' & ')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Active Credentials</span>
                <span className="text-white font-bold">{selectedUser.totalKeys} Keys / Roles</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Stale Exposure</span>
                <span className="text-rose-400 font-bold">{selectedUser.flaggedCount} Flagged</span>
              </div>
            </div>

            {/* List of keys associated with this user */}
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
                Bound IAM Keys &amp; API Tokens ({flaggedKeys.filter(k => k.ownerId === selectedUser.id).length})
              </span>

              <div className="space-y-2">
                {flaggedKeys.filter(k => k.ownerId === selectedUser.id).length === 0 ? (
                  <p className="text-xs text-slate-400 font-mono py-4 text-center">
                    No dormant or over-privileged keys flagged for this user.
                  </p>
                ) : (
                  flaggedKeys.filter(k => k.ownerId === selectedUser.id).map(k => (
                    <div 
                      key={k.id}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/25 flex items-center justify-between text-xs font-mono hover:border-emerald-400/50 transition-colors"
                    >
                      <div className="space-y-1 max-w-sm">
                        <span className="font-bold text-white block truncate">{k.name}</span>
                        <code className="text-[11px] text-amber-300">{k.keyId}</code>
                        <span className="text-slate-500 block text-[10px]">{k.reasoning}</span>
                      </div>

                      <div className="text-right space-y-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-rose-950 text-rose-300 border border-rose-500/50 block">
                          Risk {k.riskScore} • {k.idleDays}d
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          {k.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-800 hover:bg-slate-700 text-white transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
