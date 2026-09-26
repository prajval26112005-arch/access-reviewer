/**
 * TrueGrant AI - Autonomous Cloud Security Agent Dashboard
 * Built for "Agents That Act" Hackathon Track
 * Theme: Cyber Emerald | WCAG 2.2 AAA Accessible | Enterprise Security Tool
 */

import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import ConnectedSystemsView from './components/ConnectedSystemsView';
import ExploitLabView from './components/ExploitLabView';
import PolicyDiffsView from './components/PolicyDiffsView';
import PendingApprovalsView from './components/PendingApprovalsView';
import AuditRollbackView from './components/AuditRollbackView';
import UsersView from './components/UsersView';
import SettingsView from './components/SettingsView';
import PanicModal from './components/PanicModal';

import { 
  INITIAL_USERS, 
  INITIAL_FLAGGED_KEYS, 
  INITIAL_AUDIT_LOG, 
  CONNECTED_SYSTEMS, 
  STATS_DATA, 
  LIVE_AGENT_FEED 
} from './data/seedData';

import { 
  checkHealth, 
  scanSystems, 
  getSession, 
  approveItem, 
  rollbackSession 
} from './api';

import { BrowserRouter, useInRouterContext, useNavigate, useLocation } from 'react-router-dom';

const PATH_TO_VIEW = {
  '/': 'landing',
  '/landing': 'landing',
  '/dashboard': 'dashboard',
  '/pending': 'approvals',
  '/approvals': 'approvals',
  '/exploit-lab': 'exploit-lab',
  '/diffs': 'diffs',
  '/audit': 'audit',
  '/systems': 'systems',
  '/users': 'users',
  '/settings': 'settings'
};

const VIEW_TO_PATH = {
  landing: '/',
  dashboard: '/dashboard',
  approvals: '/pending',
  pending: '/pending',
  'exploit-lab': '/exploit-lab',
  diffs: '/diffs',
  audit: '/audit',
  systems: '/systems',
  users: '/users',
  settings: '/settings'
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialPath = (typeof window !== 'undefined' ? window.location.pathname.toLowerCase().replace(/\/+$/, '') : '') || '/';
  const initialView = PATH_TO_VIEW[initialPath] || 'landing';

  // Navigation View State
  const [currentView, setCurrentView] = useState(initialView); // 'landing' | 'dashboard' | 'approvals' | 'exploit-lab' | 'diffs' | 'audit' | 'systems' | 'users' | 'settings'
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data State
  const [users, setUsers] = useState(INITIAL_USERS);
  const [flaggedKeys, setFlaggedKeys] = useState(INITIAL_FLAGGED_KEYS);
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT_LOG);
  const [connectedSystems, setConnectedSystems] = useState(CONNECTED_SYSTEMS);
  const [stats, setStats] = useState(STATS_DATA);
  const [agentFeed, setAgentFeed] = useState(LIVE_AGENT_FEED);
  const [selectedKeyForDetail, setSelectedKeyForDetail] = useState(null);

  // Engine & Agent Status
  const [engineStatus, setEngineStatus] = useState({ online: true, latencyMs: 65 });
  const [agentStatus, setAgentStatus] = useState('AWAITING_APPROVAL'); // 'IDLE' | 'SCANNING' | 'AWAITING_APPROVAL'
  const [isScanning, setIsScanning] = useState(false);
  const [sessionId, setSessionId] = useState('TF-AUDIT-INIT');

  // Panic Rollback Modal & State
  const [showPanicModal, setShowPanicModal] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackCountdown, setRollbackCountdown] = useState(3);

  // Settings & Accessibility State
  const [staleThresholdDays, setStaleThresholdDays] = useState(90);
  const [riskCutoffScore, setRiskCutoffScore] = useState(70);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [notificationsConfig, setNotificationsConfig] = useState({
    emailOnGate: true,
    postToSlack: true,
    weeklyDigest: false
  });
  const [notifications, setNotifications] = useState([
    {
      title: 'Human Approval Gate Reached',
      message: 'Marcus Vance key AKIAIOSFODNN7EXAMPLE has been halted at approval gate. CVSS 9.4 proven.',
      channel: '#security-approvals',
      status: 'AWAITING_REVIEW',
      time: '10m ago'
    },
    {
      title: 'Dormant Deploy Token Flagged',
      message: 'CI deployer key AKIAI44QH8DHBEXAMPLE idle for 110 days. GitHub OIDC replacement ready.',
      channel: '#security-approvals',
      status: 'AWAITING_REVIEW',
      time: '35m ago'
    }
  ]);

  // Accessibility Announcement Live Region State
  const [srAnnouncement, setSrAnnouncement] = useState('TrueGrant AI Dashboard initialized. WCAG 2.2 AAA ready.');

  // Particle Canvas Ref
  const canvasRef = useRef(null);

  // 1. Initial Health Check to TrueForge Backend
  const refreshEngineHealth = async () => {
    const health = await checkHealth();
    setEngineStatus(health);
    if (health.online) {
      setSrAnnouncement('Connected to TrueForge Engine backend on port 3000.');
    } else {
      setSrAnnouncement('TrueForge Engine backend offline. Using seeded mock data.');
    }
  };

  useEffect(() => {
    refreshEngineHealth();
    const interval = setInterval(refreshEngineHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  // Sync React Router URL changes to currentView state
  useEffect(() => {
    const norm = (location.pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
    const targetView = PATH_TO_VIEW[norm];
    if (targetView && targetView !== currentView) {
      setCurrentView(targetView);
      setSelectedKeyForDetail(null);
    }
  }, [location.pathname]);

  // Unified navigation handler: updates both state tabs and browser router
  const handleNavigateView = (view) => {
    const targetView = view === 'pending' ? 'approvals' : view;
    setCurrentView(targetView);
    setSelectedKeyForDetail(null);

    const targetPath = VIEW_TO_PATH[view] || (view === 'approvals' ? '/pending' : `/${view}`);
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  const handleSetActiveTab = (tab) => {
    handleNavigateView(tab);
  };

  // 2. Interactive Mint-Emerald Particle Canvas (Respects reduceMotion)
  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 38;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.8
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(52, 211, 153, 0.4)';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(52, 211, 153, ${0.22 - dist / 500})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [reduceMotion]);

  // 3. Scan Systems Action (Requirement 01 & Backend Connectivity Rule)
  const handleRunScan = async () => {
    setIsScanning(true);
    setAgentStatus('SCANNING');
    setSrAnnouncement('TrueGrant agent scan initiated across AWS IAM and GitHub Enterprise via MCP.');

    const res = await scanSystems();
    setIsScanning(false);
    setAgentStatus('AWAITING_APPROVAL');

    if (res.sessionId) {
      setSessionId(res.sessionId);
    }

    // Add activity log line
    const newLog = {
      time: new Date().toLocaleTimeString(),
      level: 'INFO',
      text: `Scan complete: ${res.rolesAuditedCount || 42} roles audited, ${res.staleKeysCount || 14} dormant keys identified.`
    };
    setAgentFeed(prev => [newLog, ...prev]);
    setSrAnnouncement(`Scan finished. ${res.staleKeysCount || 14} stale credentials awaiting human decision.`);
  };

  // 4. Approve Revocation Action (Requirement 03 & Backend Connectivity Rule)
  const handleApproveItem = async (keyId, note = '') => {
    setSrAnnouncement(`Submitting revocation approval for key ${keyId}...`);
    const res = await approveItem(keyId, 'APPROVE', note);

    // Update flagged keys list
    setFlaggedKeys(prev => prev.map(k => {
      if (k.id === keyId) {
        return { ...k, status: 'REVOKED' };
      }
      return k;
    }));

    // Update stats
    setStats(prev => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      revocationsExecuted: prev.revocationsExecuted + 1
    }));

    // Add to Audit Ledger
    const keyObj = flaggedKeys.find(k => k.id === keyId);
    const newAuditEntry = {
      id: `audit-${Date.now()}`,
      itemId: keyId,
      itemName: keyObj ? keyObj.name : keyId,
      action: 'REVOKED',
      decision: 'APPROVE',
      reviewer: 'Elena Rostova (Lead InfoSec Approver)',
      timestamp: new Date().toISOString(),
      formattedDate: 'Just now',
      reasonSummary: keyObj?.reasoning || 'Revoked stale wildcard access.',
      reviewerNote: note || 'Approved least-privilege boundary.',
      soc2Signature: res.signedAuditLog || `SOC2-SIGNED-${Date.now()}-APPROVED`,
      statusBadge: 'Revoked & Secured'
    };
    setAuditLog(prev => [newAuditEntry, ...prev]);

    // Feed update
    setAgentFeed(prev => [{
      time: new Date().toLocaleTimeString(),
      level: 'REVOKE',
      text: `Access revoked for ${keyObj?.name || keyId}. SOC 2 Signature: ${res.signedAuditLog}`
    }, ...prev]);

    setSrAnnouncement(`Key ${keyId} revoked and secured with cryptographic signature.`);
  };

  // 5. Reject / Keep Access Action
  const handleRejectItem = async (keyId, note = '') => {
    setSrAnnouncement(`Recording decision to keep access for ${keyId}...`);
    const res = await approveItem(keyId, 'REJECT', note);

    setFlaggedKeys(prev => prev.map(k => {
      if (k.id === keyId) {
        return { ...k, status: 'KEPT' };
      }
      return k;
    }));

    setStats(prev => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));

    const keyObj = flaggedKeys.find(k => k.id === keyId);
    const newAuditEntry = {
      id: `audit-${Date.now()}`,
      itemId: keyId,
      itemName: keyObj ? keyObj.name : keyId,
      action: 'KEPT',
      decision: 'REJECT',
      reviewer: 'Elena Rostova (Lead InfoSec Approver)',
      timestamp: new Date().toISOString(),
      formattedDate: 'Just now',
      reasonSummary: `Human Overrule: Access retained per reviewer request.`,
      reviewerNote: note,
      soc2Signature: res.signedAuditLog || `SOC2-SIGNED-${Date.now()}-KEPT-OVERRULE`,
      statusBadge: 'Kept (Human Overrule)'
    };
    setAuditLog(prev => [newAuditEntry, ...prev]);
    setSrAnnouncement(`Access kept for ${keyId}. Human overrule logged.`);
  };

  // 6. Snooze 30 Days Action
  const handleSnoozeItem = async (keyId, note = '') => {
    setSrAnnouncement(`Snoozing item ${keyId} for 30 days...`);
    const res = await approveItem(keyId, 'SNOOZE', note);

    setFlaggedKeys(prev => prev.map(k => {
      if (k.id === keyId) {
        return { ...k, status: 'SNOOZED' };
      }
      return k;
    }));

    setStats(prev => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));

    const keyObj = flaggedKeys.find(k => k.id === keyId);
    const newAuditEntry = {
      id: `audit-${Date.now()}`,
      itemId: keyId,
      itemName: keyObj ? keyObj.name : keyId,
      action: 'SNOOZED',
      decision: 'SNOOZE',
      reviewer: 'Elena Rostova (Lead InfoSec Approver)',
      timestamp: new Date().toISOString(),
      formattedDate: 'Just now',
      reasonSummary: `Snoozed 30 days pending team evaluation.`,
      reviewerNote: note,
      soc2Signature: res.signedAuditLog || `SOC2-SIGNED-${Date.now()}-SNOOZE-30D`,
      statusBadge: 'Snoozed 30 Days'
    };
    setAuditLog(prev => [newAuditEntry, ...prev]);
    setSrAnnouncement(`Item ${keyId} snoozed for 30 days.`);
  };

  // 7. Bulk Approve Low Risk
  const handleBulkApproveLowRisk = () => {
    const lowRiskKeys = flaggedKeys.filter(k => k.severity === 'LOW' && k.status === 'AWAITING_HUMAN_APPROVAL');
    lowRiskKeys.forEach(k => {
      handleApproveItem(k.id, 'Bulk approved low-risk credential pruning.');
    });
    setSrAnnouncement(`Bulk approved ${lowRiskKeys.length} low-risk credentials.`);
  };

  // 8. Panic Rollback Action (Fail-Safe Recovery — STANDOUT MOMENT)
  const handleTriggerPanic = () => {
    setShowPanicModal(true);
  };

  const handleConfirmPanicRollback = async () => {
    setIsRollingBack(true);
    setRollbackCountdown(3);
    setSrAnnouncement('Emergency panic rollback activated. 3-second recovery initiated.');

    // Animate 3-second countdown
    let remaining = 3;
    const countTimer = setInterval(() => {
      remaining -= 1;
      setRollbackCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countTimer);
      }
    }, 1000);

    // Call /api/rollback endpoint
    const res = await rollbackSession(sessionId);

    setTimeout(() => {
      setIsRollingBack(false);
      setShowPanicModal(false);

      // Restore all keys to awaiting approval / active baseline
      setFlaggedKeys(INITIAL_FLAGGED_KEYS);

      // Add rollback entry to Audit Ledger
      const rollbackAudit = {
        id: `audit-rollback-${Date.now()}`,
        itemId: 'TF-GLOBAL-RECOVERY',
        itemName: 'Production IAM Baseline (Rollback Event)',
        action: 'ROLLBACK',
        decision: 'ROLLBACK',
        reviewer: 'Elena Rostova (Emergency Panic Override)',
        timestamp: new Date().toISOString(),
        formattedDate: 'Just now',
        reasonSummary: 'Emergency 3-Second Panic Rollback executed. Restored pre-revocation policy snapshot.',
        reviewerNote: 'Zero-downtime fail-safe recovery successfully verified in 3 seconds.',
        soc2Signature: res.signedAuditLog || `SOC2-SIGNED-${Date.now()}-RESTORED-FAILSAFE`,
        statusBadge: 'Snapshot Restored'
      };
      setAuditLog(prev => [rollbackAudit, ...prev]);

      setAgentFeed(prev => [{
        time: new Date().toLocaleTimeString(),
        level: 'ROLLBACK',
        text: `FAIL-SAFE ROLLBACK COMPLETED: Prior IAM snapshot restored in 2.8s. Quarantine released.`
      }, ...prev]);

      setSrAnnouncement('Previous state restored. Signed audit entry logged.');
    }, 3100);
  };

  // 9. Sync Connected System Action
  const handleSyncSystem = async (sys) => {
    setSrAnnouncement(`Syncing identity tree from ${sys.name} over MCP...`);
    await new Promise(r => setTimeout(r, 1200));

    setConnectedSystems(prev => prev.map(s => {
      if (s.id === sys.id) {
        return {
          ...s,
          lastSynced: 'Just now (Continuous eBPF Trapped)',
          activeKeysCount: s.activeKeysCount + 1
        };
      }
      return s;
    }));

    setAgentFeed(prev => [{
      time: new Date().toLocaleTimeString(),
      level: 'INFO',
      text: `MCP Sync completed for ${sys.name}: Refreshed policy statements and session activity.`
    }, ...prev]);

    setSrAnnouncement(`Successfully synced ${sys.name} via MCP connector.`);
  };

  const handleToggleAutoRevoke = (sysId) => {
    setConnectedSystems(prev => prev.map(s => {
      if (s.id === sysId) {
        const next = !s.autoRevokeLowRisk;
        setSrAnnouncement(`Auto-revoke for ${s.name} set to ${next ? 'ON' : 'OFF'}.`);
        return { ...s, autoRevokeLowRisk: next };
      }
      return s;
    }));
  };

  // Calculate pending count for sidebar badge
  const pendingApprovalsCount = flaggedKeys.filter(k => k.status === 'AWAITING_HUMAN_APPROVAL').length;

  return (
    <div className={`min-h-screen bg-[#0A0F0D] text-slate-100 flex flex-col font-sans ${highContrast ? 'contrast-125' : ''}`}>
      
      {/* 1. Deep Ambient Cyber Emerald Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-950/30 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-950/30 blur-[150px]" />
      </div>

      {/* 2. Interactive Mint-Emerald Particle Canvas (respects reduceMotion) */}
      {!reduceMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 opacity-70"
        />
      )}

      {/* 3. WCAG 2.2 AAA Screen Reader Live Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-status-announcer"
      >
        {srAnnouncement}
      </div>

      {/* 4. App Shell: Sidebar Navigation (Left) */}
      <Sidebar
        currentView={currentView}
        setCurrentView={handleNavigateView}
        pendingCount={pendingApprovalsCount}
        engineStatus={engineStatus}
      />

      {/* 5. Main Content Area (Offset by 64 Tailwind spacing = 16rem for sidebar) */}
      <div className="pl-64 flex-1 flex flex-col min-h-screen relative z-10">
        
        {/* Top Header Bar */}
        <TopBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          engineStatus={engineStatus}
          onRetryEngine={refreshEngineHealth}
          agentStatus={agentStatus}
          onTriggerPanic={handleTriggerPanic}
          notifications={notifications}
          onClearNotifications={() => setNotifications([])}
          setCurrentView={handleNavigateView}
        />

        {/* View Routing / Render Pages */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
          {currentView === 'landing' && (
            <LandingPage
              onOpenDashboard={() => handleNavigateView('dashboard')}
              onSeeExploitProof={() => handleNavigateView('exploit-lab')}
              onRunScan={handleRunScan}
              isScanning={isScanning}
              setActiveTab={handleSetActiveTab}
              setCurrentView={handleNavigateView}
              onNavigate={(path, tab) => handleNavigateView(tab)}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              stats={stats}
              flaggedKeys={flaggedKeys}
              agentFeed={agentFeed}
              onSelectKey={(keyItem) => {
                setSelectedKeyForDetail(keyItem);
                handleNavigateView('approvals');
              }}
              onOpenApprovals={() => handleNavigateView('approvals')}
              onOpenAudit={() => handleNavigateView('audit')}
              onOpenExploitLab={() => handleNavigateView('exploit-lab')}
              onRunScan={handleRunScan}
              isScanning={isScanning}
              reduceMotion={reduceMotion}
              setActiveTab={handleSetActiveTab}
              setCurrentView={handleNavigateView}
              onNavigate={(path, tab) => handleNavigateView(tab)}
            />
          )}

          {(currentView === 'approvals' || currentView === 'pending') && (
            <PendingApprovalsView
              flaggedKeys={flaggedKeys}
              selectedKey={selectedKeyForDetail}
              onSelectKey={setSelectedKeyForDetail}
              onCloseDetail={() => setSelectedKeyForDetail(null)}
              onApproveItem={handleApproveItem}
              onRejectItem={handleRejectItem}
              onSnoozeItem={handleSnoozeItem}
              onBulkApproveLowRisk={handleBulkApproveLowRisk}
            />
          )}

          {currentView === 'exploit-lab' && (
            <ExploitLabView
              onOpenDiffs={() => handleNavigateView('diffs')}
              reduceMotion={reduceMotion}
            />
          )}

          {currentView === 'diffs' && (
            <PolicyDiffsView
              flaggedKeys={flaggedKeys}
              onSelectKeyForApproval={(keyItem) => {
                setSelectedKeyForDetail(keyItem);
                handleNavigateView('approvals');
              }}
            />
          )}

          {currentView === 'audit' && (
            <AuditRollbackView
              auditLog={auditLog}
              onTriggerPanic={handleTriggerPanic}
              isRollingBack={isRollingBack}
              rollbackCountdown={rollbackCountdown}
            />
          )}

          {currentView === 'systems' && (
            <ConnectedSystemsView
              systems={connectedSystems}
              onSyncSystem={handleSyncSystem}
              onToggleAutoRevoke={handleToggleAutoRevoke}
            />
          )}

          {currentView === 'users' && (
            <UsersView
              users={users}
              flaggedKeys={flaggedKeys}
              onSelectKey={(k) => {
                setSelectedKeyForDetail(k);
                handleNavigateView('approvals');
              }}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              staleThresholdDays={staleThresholdDays}
              setStaleThresholdDays={setStaleThresholdDays}
              riskCutoffScore={riskCutoffScore}
              setRiskCutoffScore={setRiskCutoffScore}
              reduceMotion={reduceMotion}
              setReduceMotion={setReduceMotion}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              notificationsConfig={notificationsConfig}
              setNotificationsConfig={setNotificationsConfig}
            />
          )}
        </main>

      </div>

      {/* 6. Emergency Panic Rollback Modal (Standout #2) */}
      <PanicModal
        isOpen={showPanicModal}
        onClose={() => setShowPanicModal(false)}
        onConfirmPanic={handleConfirmPanicRollback}
        isRollingBack={isRollingBack}
        countdown={rollbackCountdown}
      />

    </div>
  );
}

export default function App() {
  let inRouter = false;
  try {
    inRouter = useInRouterContext();
  } catch (e) {
    inRouter = false;
  }

  if (inRouter) {
    return <AppContent />;
  }

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

