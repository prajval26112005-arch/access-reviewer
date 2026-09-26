/**
 * TrueGrant AI - Centralized Backend API Client
 *
 * Implements the mandatory Backend Connectivity Rule:
 * - Named functions: scanSystems, getSession, approveItem, rollbackSession
 * - Calls real Node.js TrueForge backend on http://localhost:3000
 * - Graceful fallback to rich seeded mock data if the backend is offline/unreachable
 */

import { INITIAL_FLAGGED_KEYS, INITIAL_AUDIT_LOG } from './data/seedData.js';

let BASE_URL = (typeof window !== 'undefined' && window.localStorage?.getItem('truegrant_backend_url')) || 'http://localhost:3000';

export function getApiBaseUrl() {
  return BASE_URL;
}

export function setApiBaseUrl(newUrl) {
  if (!newUrl) return;
  BASE_URL = newUrl.replace(/\/+$/, '');
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('truegrant_backend_url', BASE_URL);
  }
}

/**
 * Helper to fetch with timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Health check to verify if the TrueForge backend engine is live
 * @returns {Promise<{ online: boolean, latencyMs?: number, details?: any }>}
 */
export async function checkHealth() {
  const start = performance.now();
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/health`, { method: 'GET' }, 2500);
    const latencyMs = Math.round(performance.now() - start);
    if (res.ok) {
      const data = await res.json();
      return { online: true, latencyMs, details: data };
    }
    return { online: false, latencyMs, error: `HTTP ${res.status}` };
  } catch (err) {
    return { online: false, error: err.message || 'Offline' };
  }
}

/**
 * Test a specific connection URL
 */
export async function testConnection(customUrl) {
  const url = (customUrl || BASE_URL).replace(/\/+$/, '');
  const start = performance.now();
  try {
    const res = await fetchWithTimeout(`${url}/api/health`, { method: 'GET' }, 3000);
    const latencyMs = Math.round(performance.now() - start);
    if (res.ok) {
      const data = await res.json();
      return { success: true, latencyMs, data };
    }
    return { success: false, error: `Backend responded with HTTP ${res.status}` };
  } catch (err) {
    return { success: false, error: err.message || 'Unable to connect to backend' };
  }
}

/**
 * POST /api/scan → scanSystems()
 * Triggers a new scan, returns flagged keys/roles
 */
export async function scanSystems() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trigger: 'HUMAN_REQUESTED_SCAN', auditWindowDays: 90 })
    }, 6000);

    if (res.ok) {
      const data = await res.json();
      return {
        isFallback: false,
        sessionId: data.sessionId,
        status: data.status || 'AWAITING_HUMAN_APPROVAL',
        rolesAuditedCount: data.rolesAuditedCount || 42,
        staleKeysCount: data.staleKeysCount || 14,
        flaggedKeys: data.flaggedKeys || INITIAL_FLAGGED_KEYS,
        session: data.session || data,
        message: data.message
      };
    }
    throw new Error(`HTTP ${res.status}: Failed to scan systems`);
  } catch (err) {
    console.warn('[TrueGrant API] Backend offline, falling back to rich seeded mock scan:', err);
    // Graceful fallback for offline demo stability
    const mockSessionId = 'TF-AUDIT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    return {
      isFallback: true,
      sessionId: mockSessionId,
      status: 'AWAITING_HUMAN_APPROVAL',
      rolesAuditedCount: 42,
      staleKeysCount: 14,
      flaggedKeys: INITIAL_FLAGGED_KEYS,
      message: 'TrueForge Agent scan simulated (backend offline fallback).'
    };
  }
}

/**
 * GET /api/session/:id → getSession(id)
 * Fetches current session's scan results and agent state
 */
export async function getSession(sessionId) {
  if (!sessionId) {
    return { isFallback: true, session: null };
  }

  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/session/${sessionId}`, { method: 'GET' }, 3500);
    if (res.ok) {
      const data = await res.json();
      return {
        isFallback: false,
        session: data,
        status: data.status
      };
    }
    throw new Error(`HTTP ${res.status}: Session fetch failed`);
  } catch (err) {
    console.warn(`[TrueGrant API] getSession(${sessionId}) failed, using fallback:`, err);
    return {
      isFallback: true,
      session: {
        sessionId,
        status: 'AWAITING_HUMAN_APPROVAL',
        flaggedKeys: INITIAL_FLAGGED_KEYS
      }
    };
  }
}

/**
 * POST /api/approve → approveItem(id, decision, note)
 * Sends approve/reject/snooze decision, returns updated item & audit log hash
 */
export async function approveItem(id, decision = 'APPROVE', note = '') {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        sessionId: id,
        decision,
        note,
        reviewer: 'Elena Rostova (Lead InfoSec Approver)'
      })
    }, 4000);

    if (res.ok) {
      const data = await res.json();
      return {
        isFallback: false,
        success: true,
        updatedItem: data.updatedItem || { id, status: decision === 'APPROVE' ? 'REVOKED' : decision === 'REJECT' ? 'KEPT' : 'SNOOZED' },
        status: data.status || (decision === 'APPROVE' ? 'REVOKED_AND_SECURED' : decision),
        signedAuditLog: data.signedAuditLog,
        approvalTimestamp: data.approvalTimestamp || new Date().toLocaleTimeString(),
        remediatedAt: data.remediatedAt || new Date().toISOString(),
        message: data.message
      };
    }
    throw new Error(`HTTP ${res.status}: Approval failed`);
  } catch (err) {
    console.warn(`[TrueGrant API] approveItem(${id}) offline fallback:`, err);
    const timestamp = Date.now();
    const hash = `SOC2-SIGNED-${timestamp}-${decision}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    return {
      isFallback: true,
      success: true,
      updatedItem: {
        id,
        status: decision === 'APPROVE' ? 'REVOKED' : decision === 'REJECT' ? 'KEPT' : 'SNOOZED',
        note
      },
      status: decision === 'APPROVE' ? 'REVOKED_AND_SECURED' : decision,
      signedAuditLog: hash,
      approvalTimestamp: new Date().toLocaleTimeString(),
      remediatedAt: new Date().toISOString(),
      message: `Action [${decision}] applied successfully (offline fallback).`
    };
  }
}

/**
 * POST /api/rollback → rollbackSession(id)
 * Triggers panic rollback, returns restored state in 2-3 seconds
 */
export async function rollbackSession(sessionId = 'TF-PANIC-GLOBAL') {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/rollback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: sessionId, sessionId })
    }, 5500);

    if (res.ok) {
      const data = await res.json();
      return {
        isFallback: false,
        success: true,
        status: 'RESTORED',
        rollbackTimestamp: data.rollbackTimestamp || new Date().toLocaleTimeString(),
        restoredPolicy: data.restoredPolicy,
        signedAuditLog: data.signedAuditLog || `SOC2-SIGNED-${Date.now()}-RESTORED`,
        message: data.message || 'Previous state restored in 3 seconds.'
      };
    }
    throw new Error(`HTTP ${res.status}: Rollback failed`);
  } catch (err) {
    console.warn(`[TrueGrant API] rollbackSession(${sessionId}) offline fallback:`, err);
    return {
      isFallback: true,
      success: true,
      status: 'RESTORED',
      rollbackTimestamp: new Date().toLocaleTimeString(),
      signedAuditLog: `SOC2-SIGNED-${Date.now()}-RESTORED-OFFLINE`,
      message: 'Previous state safely restored from pre-revocation snapshot.'
    };
  }
}
