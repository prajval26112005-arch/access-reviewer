/**
 * CoreRequirementCards.jsx
 * Track 05: Agents That Act - TrueGrant AI
 * 
 * 3 Core Hackathon Requirement Cards:
 * 1. Card 1: Reaches Real Infrastructure (Requirement 01) -> /systems
 * 2. Card 2: Sandboxed Exploit Proof (Requirement 02) -> /exploit-lab
 * 3. Card 3: Human Approval Gate (Requirement 03) -> /pending
 * 
 * Fully interactive, WCAG 2.2 AAA accessible, dual routing support (useNavigate + setActiveTab),
 * Cyber Emerald glassmorphism design system (#0A0F0D), and animated directional arrows.
 */

import React from 'react';
import { useInRouterContext, useNavigate } from 'react-router-dom';
import { 
  Server, 
  Terminal, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

function CardsRenderer({
  setActiveTab,
  setCurrentView,
  onNavigate,
  routerNavigate,
  className = ''
}) {
  /**
   * Dual Routing Navigation Handler:
   * Supports react-router-dom (useNavigate()), tab state handlers (setActiveTab(), setCurrentView()),
   * and browser history (window.history.pushState) for seamless cross-router compatibility.
   */
  const handleCardClick = (path, tabId) => {
    // 1. React Router DOM navigation (if router context available)
    if (routerNavigate && typeof routerNavigate === 'function') {
      try {
        routerNavigate(path);
      } catch (err) {
        console.warn('[CoreRequirementCards] react-router-dom navigation notice:', err);
      }
    }

    // 2. Tab state handler: setActiveTab()
    if (typeof setActiveTab === 'function') {
      setActiveTab(tabId);
      // Support aliases (e.g. 'pending' -> 'approvals')
      if (tabId === 'pending') {
        try {
          setActiveTab('approvals');
        } catch (_) {}
      }
    }

    // 3. Tab state handler: setCurrentView()
    if (typeof setCurrentView === 'function') {
      const viewName = tabId === 'pending' ? 'approvals' : tabId;
      setCurrentView(viewName);
    }

    // 4. Custom onNavigate callback
    if (typeof onNavigate === 'function') {
      onNavigate(path, tabId);
    }

    // 5. HTML5 History API fallback to ensure browser URL updates cleanly
    if (typeof window !== 'undefined' && window.history?.pushState) {
      try {
        window.history.pushState({ tab: tabId, path }, '', path);
        window.dispatchEvent(new Event('popstate'));
      } catch (_) {}
    }
  };

  /**
   * Keyboard accessibility handler (Enter and Space keys per WCAG 2.2 AAA)
   */
  const handleKeyDown = (e, path, tabId) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      handleCardClick(path, tabId);
    }
  };

  const cardsData = [
    {
      id: 'requirement-01-infrastructure',
      path: '/systems',
      tabId: 'systems',
      ariaLabel: 'Navigate to Connected Infrastructure Providers',
      requirementBadge: 'Requirement 01',
      title: 'Reaches real infrastructure',
      icon: Server,
      iconContainerStyle: 'bg-emerald-950/90 text-emerald-400 border border-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.35)]',
      badgeStyle: 'bg-emerald-950 text-emerald-300 border-emerald-500/50',
      description: (
        <>
          Directly connects to AWS IAM (<code className="text-emerald-300 font-mono font-semibold">@mcp/aws-iam</code>) and GitHub Enterprise (<code className="text-emerald-300 font-mono font-semibold">@mcp/github-mcp</code>). Continuously maps identity boundaries, inactive API keys, and orphaned service accounts without fragile read scripts.
        </>
      ),
      footerIcon: CheckCircle2,
      footerText: 'Multi-cloud identity via MCP protocol',
      footerColor: 'text-emerald-300',
      actionText: 'View Connected Systems'
    },
    {
      id: 'requirement-02-sandbox',
      path: '/exploit-lab',
      tabId: 'exploit-lab',
      ariaLabel: 'Navigate to Exploit Lab Sandbox',
      requirementBadge: 'Requirement 02 • Runs What It Writes',
      title: 'Proves exploits safely, in a sandbox',
      icon: Terminal,
      iconContainerStyle: 'bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.35)]',
      badgeStyle: 'bg-rose-950 text-rose-200 border-rose-500/50',
      description: (
        <>
          Instead of generating hypothetical hallucinations, TrueGrant AI synthesizes active lateral movement exploit scripts and executes them inside an isolated eBPF-monitored container to prove that <code className="text-rose-300 font-mono font-semibold">IAM:ListKeys -&gt; S3:GetObject -&gt; SecretsManager:Dump</code> is genuinely exploitable.
        </>
      ),
      footerIcon: AlertTriangle,
      footerText: 'Zero production blast radius',
      footerColor: 'text-rose-300',
      actionText: 'Launch Exploit Lab'
    },
    {
      id: 'requirement-03-approval-gate',
      path: '/pending',
      tabId: 'pending',
      ariaLabel: 'Navigate to Pending Approvals Queue',
      requirementBadge: 'Requirement 03 • Knows When to Stop',
      title: 'Never acts without a human',
      icon: Lock,
      iconContainerStyle: 'bg-teal-950/90 text-teal-300 border border-teal-400/50 shadow-[0_0_20px_rgba(45,212,191,0.35)]',
      badgeStyle: 'bg-teal-950 text-teal-200 border-teal-500/50',
      description: (
        <>
          Every destructive IAM revocation halts at an unbypassable Human Approval Gate. The agent provides verified CloudTrail replays, dependencies, blast-radius metrics, and instant 3-second fail-safe rollback snapshots if emergency restoration is required.
        </>
      ),
      footerIcon: RotateCcw,
      footerText: 'Guaranteed 3-second panic recovery',
      footerColor: 'text-teal-300',
      actionText: 'Enter Approvals Queue'
    }
  ];

  return (
    <section 
      aria-label="Core Capabilities" 
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}
    >
      {cardsData.map((card) => {
        const Icon = card.icon;
        const FooterIcon = card.footerIcon;

        return (
          <div
            key={card.id}
            role="button"
            tabIndex={0}
            aria-label={card.ariaLabel}
            onClick={() => handleCardClick(card.path, card.tabId)}
            onKeyDown={(e) => handleKeyDown(e, card.path, card.tabId)}
            className="group relative cursor-pointer select-none rounded-2xl p-6 glass-cyber-panel border border-emerald-500/30 hover:border-emerald-400/90 transition-all duration-300 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F0D] flex flex-col justify-between"
          >
            {/* Ambient cyber hover highlight */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Top Section */}
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${card.iconContainerStyle}`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Route path badge with directional arrow */}
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400 group-hover:text-emerald-300 transition-colors">
                  <span className="text-[11px] font-semibold tracking-wide bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 group-hover:border-emerald-500/40">
                    {card.path}
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-400 transform group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
                </div>
              </div>

              <div>
                <span className={`inline-block text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded border mb-2.5 ${card.badgeStyle}`}>
                  {card.requirementBadge}
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-200 transition-colors">
                  {card.title}
                </h3>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {card.description}
              </p>
            </div>

            {/* Bottom Footer Section */}
            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono relative z-10">
              <div className={`flex items-center gap-2 font-medium ${card.footerColor}`}>
                <FooterIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{card.footerText}</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-semibold group-hover:underline flex items-center gap-1 shrink-0 ml-2">
                <span>{card.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}

// Inner component safe with React Router hook
function CoreRequirementCardsWithRouter(props) {
  const navigate = useNavigate();
  return <CardsRenderer {...props} routerNavigate={navigate} />;
}

// Main exported component with graceful fallback if rendered outside Router context
export default function CoreRequirementCards(props) {
  let inRouter = false;
  try {
    inRouter = useInRouterContext();
  } catch (e) {
    inRouter = false;
  }

  if (inRouter) {
    return <CoreRequirementCardsWithRouter {...props} />;
  }

  return <CardsRenderer {...props} routerNavigate={null} />;
}
