import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Bell, 
  Shield, 
  Eye, 
  Server, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  MessageSquare,
  Send,
  ExternalLink
} from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, testConnection } from '../api';

export default function SettingsView({
  staleThresholdDays,
  setStaleThresholdDays,
  riskCutoffScore,
  setRiskCutoffScore,
  reduceMotion,
  setReduceMotion,
  highContrast,
  setHighContrast,
  notificationsConfig,
  setNotificationsConfig
}) {
  const [backendUrl, setBackendUrlState] = useState(getApiBaseUrl());
  const [testingBackend, setTestingBackend] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T000/B000/XXXX');
  const [webhookSent, setWebhookSent] = useState(false);

  const approversList = [
    { name: 'Elena Rostova', role: 'Lead InfoSec Approver', badge: 'Primary Approver', email: 'elena.rostova@cyber-emerald.io' },
    { name: 'Sarah Chen', role: 'Staff DevOps Lead', badge: 'Owner', email: 'sarah.chen@cyber-emerald.io' },
    { name: 'Alex Rivera', role: 'CI/CD Systems Architect', badge: 'Approver', email: 'alex.rivera@cyber-emerald.io' }
  ];

  const handleSaveBackendUrl = () => {
    setApiBaseUrl(backendUrl);
    setTestResult({ success: true, message: 'Backend URL updated in local storage.' });
    setTimeout(() => setTestResult(null), 3000);
  };

  const handleTestBackend = async () => {
    setTestingBackend(true);
    setTestResult(null);
    const result = await testConnection(backendUrl);
    setTestingBackend(false);
    setTestResult(result);
  };

  const handleSendTestWebhook = () => {
    setWebhookSent(true);
    setTimeout(() => setWebhookSent(false), 2500);
  };

  return (
    <div className="space-y-8 py-2">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Governance Policies &amp; Integrations</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Security Engine Settings
          </h2>
          <p className="text-xs text-slate-300 font-mono mt-1">
            Configure automated discovery thresholds, Slack webhook delivery, accessibility, and backend connection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: Governance Threshold Sliders */}
        <section aria-labelledby="sliders-title" className="glass-cyber-panel p-6 rounded-2xl border border-emerald-500/30 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 id="sliders-title" className="text-base font-bold text-white font-mono">
              Detection Threshold Sliders
            </h3>
          </div>

          {/* Slider 1: Idle Days */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="idle-days-slider" className="text-slate-200 font-semibold">Flag as stale after N days idle:</label>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                {staleThresholdDays} Days
              </span>
            </div>
            <input
              id="idle-days-slider"
              type="range"
              min={30}
              max={180}
              step={5}
              value={staleThresholdDays}
              onChange={(e) => setStaleThresholdDays(parseInt(e.target.value, 10))}
              aria-label="Flag as stale after N days idle"
              className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30d (Aggressive)</span>
              <span>90d (Standard SLA)</span>
              <span>180d (Relaxed)</span>
            </div>
          </div>

          {/* Slider 2: Risk Score Cutoff */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="risk-score-slider" className="text-slate-200 font-semibold">High-risk score cutoff:</label>
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 font-bold">
                Score &ge; {riskCutoffScore}
              </span>
            </div>
            <input
              id="risk-score-slider"
              type="range"
              min={50}
              max={95}
              step={1}
              value={riskCutoffScore}
              onChange={(e) => setRiskCutoffScore(parseInt(e.target.value, 10))}
              aria-label="High-risk score cutoff"
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>50 (Broad Review)</span>
              <span>70 (Default Critical)</span>
              <span>95 (CVSS 9+ Only)</span>
            </div>
          </div>
        </section>

        {/* SECTION 2: Accessibility & WCAG 2.2 AAA */}
        <section aria-labelledby="a11y-title" className="glass-cyber-panel p-6 rounded-2xl border border-emerald-500/30 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <Eye className="w-4 h-4 text-emerald-400" />
            <h3 id="a11y-title" className="text-base font-bold text-white font-mono">
              Accessibility &amp; Visual Comfort (WCAG 2.2 AAA)
            </h3>
          </div>

          <div className="space-y-4">
            {/* Reduce Motion Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-white block">Reduce Motion</span>
                <span className="text-[11px] text-slate-400">
                  Disables live background particles and card count-up transitions.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reduceMotion}
                  onChange={(e) => setReduceMotion(e.target.checked)}
                  aria-label="Toggle reduce motion"
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            {/* High Contrast Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-white block">High Contrast Mode</span>
                <span className="text-[11px] text-slate-400">
                  Enforces 14:1 ultra-contrast text and solid borders.
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  aria-label="Toggle high contrast mode"
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>
          </div>
        </section>

      </div>

      {/* SECTION 3: Multi-Channel Notifications & Slack Preview */}
      <section aria-labelledby="notifications-title" className="glass-cyber-panel p-6 rounded-2xl border border-emerald-500/30 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <Bell className="w-4 h-4 text-emerald-400" />
          <h3 id="notifications-title" className="text-base font-bold text-white font-mono">
            Multi-Channel Human Approval Notifications
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Toggles & Webhook input (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="space-y-3">
              {/* Toggle 1: Email */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-200">Email me when item reaches human approval gate</span>
                <input
                  type="checkbox"
                  checked={notificationsConfig.emailOnGate}
                  onChange={(e) => setNotificationsConfig({ ...notificationsConfig, emailOnGate: e.target.checked })}
                  aria-label="Toggle email notifications"
                  className="accent-emerald-400 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Toggle 2: Slack */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-200">Post gated approvals to Slack (#security-approvals)</span>
                <input
                  type="checkbox"
                  checked={notificationsConfig.postToSlack}
                  onChange={(e) => setNotificationsConfig({ ...notificationsConfig, postToSlack: e.target.checked })}
                  aria-label="Toggle Slack notifications"
                  className="accent-emerald-400 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Toggle 3: Weekly Digest */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs font-mono text-slate-200">Weekly access-posture executive digest</span>
                <input
                  type="checkbox"
                  checked={notificationsConfig.weeklyDigest}
                  onChange={(e) => setNotificationsConfig({ ...notificationsConfig, weeklyDigest: e.target.checked })}
                  aria-label="Toggle weekly digest"
                  className="accent-emerald-400 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            {/* Webhook Input Field */}
            <div className="space-y-2 pt-2">
              <label htmlFor="webhook-input" className="text-xs font-mono text-slate-300 font-semibold block">
                Webhook URL (Slack / Teams / PagerDuty):
              </label>
              <div className="flex gap-2">
                <input
                  id="webhook-input"
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <button
                  onClick={handleSendTestWebhook}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 shrink-0"
                >
                  {webhookSent ? 'Sent!' : 'Send Test'}
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Realistic Mock Slack Message Preview (6 cols) */}
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
              Slack Interactive Message Preview (#security-approvals):
            </span>

            <div className="p-4 rounded-2xl bg-[#1A1D21] border border-slate-800 space-y-3 font-sans shadow-xl">
              {/* Slack Header */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  TG
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">TrueGrant AI Bot</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1 rounded">APP</span>
                    <span className="text-[10px] text-slate-500">Just now</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block font-mono">Channel: #security-approvals</span>
                </div>
              </div>

              {/* Slack Card Body */}
              <div className="border-l-4 border-rose-500 pl-3 space-y-2 text-xs text-slate-200">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span className="text-rose-400 font-mono">CRITICAL VULNERABILITY:</span>
                  <span>Marcus Vance (142d idle)</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Agent executed isolated sandbox exploit proof: <code className="text-rose-300 font-mono text-[10px]">IAM:ListKeys -&gt; S3:GetObject -&gt; SecretsManager:Dump</code>.
                  Surgical least-privilege policy synthesized. <strong>Human sign-off required to revoke.</strong>
                </p>

                {/* Slack Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <button 
                    disabled 
                    className="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold text-xs cursor-default"
                  >
                    Approve Revocation
                  </button>
                  <button 
                    disabled 
                    className="px-3 py-1.5 rounded bg-slate-800 text-slate-200 font-medium text-xs cursor-default border border-slate-700"
                  >
                    View Details
                  </button>
                  <button 
                    disabled 
                    className="px-3 py-1.5 rounded bg-slate-800 text-amber-300 font-medium text-xs cursor-default border border-slate-700"
                  >
                    Snooze 30d
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4: Authorized Approvers & Backend Connection Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Approvers List (6 cols) */}
        <section aria-labelledby="approvers-title" className="lg:col-span-6 glass-cyber-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 id="approvers-title" className="text-base font-bold text-white font-mono">
              Authorized Reviewers &amp; Approvers
            </h3>
          </div>

          <div className="space-y-2">
            {approversList.map((appr, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-bold text-white block">{appr.name}</span>
                  <span className="text-[10px] text-slate-400">{appr.email}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  {appr.badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Backend Connection Settings (6 cols) */}
        <section aria-labelledby="backend-title" className="lg:col-span-6 glass-cyber-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 id="backend-title" className="text-base font-bold text-white font-mono">
              TrueForge Backend Connection Settings
            </h3>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="backend-url-input" className="text-xs font-mono text-slate-300 block font-semibold">
                Backend API Endpoint URL:
              </label>
              <input
                id="backend-url-input"
                type="url"
                value={backendUrl}
                onChange={(e) => setBackendUrlState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSaveBackendUrl}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30"
              >
                Save URL
              </button>

              <button
                onClick={handleTestBackend}
                disabled={testingBackend}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-400/50"
              >
                <RefreshCw className={`w-3 h-3 ${testingBackend ? 'animate-spin' : ''}`} />
                <span>{testingBackend ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs font-mono ${
                testResult.success 
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300' 
                  : 'bg-rose-950/70 border-rose-500/40 text-rose-300'
              }`}>
                {testResult.success ? (
                  <span>Connected successfully! Latency: {testResult.latencyMs}ms.</span>
                ) : (
                  <span>Failed to connect: {testResult.error}</span>
                )}
              </div>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
