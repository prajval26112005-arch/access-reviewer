# TrueGrant AI (Access Reviewer) 🛡️🔑

> **Autonomous Cloud Security Agent & Least-Privilege Governance Platform**
> Built for **Track 05: Security Access Reviewer** in the **TrueFoundry x Polaris Hackathon: Agents That Act**.

[![TrueForge Harness](https://img.shields.io/badge/Agent_Harness-TrueForge_v0.2.1-10B981?style=for-the-badge&logo=truefoundry)](https://trueforge.dev)
[![Track 05](https://img.shields.io/badge/Hackathon_Track-05:_Access_Reviewer-34D9A8?style=for-the-badge)](https://truefoundry.com/truefoundry-hackathon)
[![WCAG 2.2 AAA](https://img.shields.io/badge/Accessibility-WCAG_2.2_AAA_100%2F100-blue?style=for-the-badge)](https://www.w3.org/TR/WCAG22/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

---

## 💡 Overview

**TrueGrant AI** turns tedious, multi-week IAM audits into an automated, zero-downtime governance workflow. The agent continuously audits live identity providers, identifies stale and over-privileged credentials (90+ days idle), proves exploitability in an eBPF sandbox container, synthesizes surgical least-privilege policy diffs verified against CloudTrail logs, and halts execution at a mandatory human approval gate prior to any destructive revocation.

> *"It finds the keys nobody remembers. It proves the danger. You approve the fix."*

---

## ⚡ Alignment with the 3 Core Harness Requirements

TrueGrant AI is built directly on top of the **TrueForge Agent Harness** to satisfy every hackathon checkpoint:

| Requirement | Implementation in TrueGrant AI | Grounding Details |
|---|---|---|
| **01. Reaches Something Real** | Connects to live identity provider APIs (**AWS IAM** & **GitHub Enterprise Org**) over **Model Context Protocol (MCP)** using `@mcp/aws-iam` and `@mcp/github-mcp`. | Queries active principal trees, policy JSON definitions, and last-used timestamps across 60+ active roles/keys. |
| **02. Runs What It Writes** | Spawns an isolated **Daytona eBPF sandbox container** (`sbx-run-35d175f7`) to execute generated Python `boto3` lateral-movement exploit scripts. | Proves lateral movement vectors (`IAM:ListKeys` → `S3:GetObject` → `SecretsManager:DumpSecrets`) with live streamed stdout/stderr logs. |
| **03. Knows When to Stop** | Enforces a strict state machine pause at **`AWAITING_HUMAN_APPROVAL`** before revoking any access. | Evaluates Blast Radius dependency microservices (`DataIngest-Worker`, `BillingSync-Lambda`) and provides a 3-second Emergency Panic Rollback. |

---

## 🎨 Theme & Accessibility Design System

- **Cyber Emerald Theme:** Near-black glassmorphism background (`#0A0F0D`), vibrant emerald accents (`#10B981` / `#34D9A8`), warning amber (`#F59E0B`), and alert red (`#EF4444`).
- **Monospace Focus:** All IAM keys, ARNs, JSON policy diffs, terminal execution logs, and cryptographic hashes are formatted in monospace (`JetBrains Mono`).
- **WCAG 2.2 AAA Compliant:** Visible 2px emerald focus rings on all interactive elements, 7:1 minimum text contrast ratio, `aria-live` status regions, full keyboard `Tab` navigation, and a "Reduce Motion" setting toggle.

---

## 📱 Core UI Views & Features

1. **Posture Dashboard** (`/dashboard`) — Real-time stat counters (Roles Audited, Stale Keys >90 Days, Sandboxed Exploit Proofs, WCAG Score), 30-day Flagged vs. Resolved trend chart, and a live agent activity feed.
2. **Exploit Lab** (`/exploit-lab`) — Visual 3-node attack chain diagram with interactive execution triggering live eBPF container logs in Daytona.
3. **Policy Diffs** (`/policy-diffs`) — GitHub-style inline policy diffs striking out wildcard permissions in red (`- s3:*`) and highlighting scoped permissions in green (`+ s3:GetObject`), verified against 90 days of CloudTrail traffic.
4. **Pending Approvals** (`/pending`) — Human-in-the-loop approval queue featuring detailed Agent Reasoning, Blast Radius cards, 0% downtime risk indicators, and 2-step confirmation buttons.
5. **Audit Ledger & Emergency Rollback** (`/audit-trail`) — Cryptographically signed SOC 2 audit ledger (`SOC2-SIGNED-179035...`) paired with a 3-second Emergency Panic Rollback snapshot restore (`SNAPSHOT-PRE-REVOKE-AES256`).
6. **Connected Systems** (`/systems`) — Live MCP connector management for AWS IAM and GitHub with "Sync Now" triggers and read-only safety badges.
7. **Users & Service Principals** (`/users`) — Identity mapping table connecting individual engineers (e.g., Marcus Vance, Sarah Chen) to their active cloud keys.
8. **Settings** (`/settings`) — Configurable detection sliders (stale threshold: 90 days), multi-channel Slack notification previews, WCAG toggles, and backend latency tester (`http://localhost:3000`).

---

## 🏗️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        React Cyber Emerald Dashboard                   │
│                            (http://localhost:5173)                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                     │ REST API (api.ts)
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     TrueForge Agent Harness Server                     │
│                            (http://localhost:3000)                     │
└──────────────┬────────────────────┬────────────────────┬───────────────┘
               │                    │                    │
               ▼                    ▼                    ▼
   ┌──────────────────────┐ ┌───────────────┐ ┌────────────────────────┐
   │ MCP Connector: AWS   │ │ MCP: GitHub   │ │ Daytona Sandbox        │
   │ (@mcp/aws-iam)       │ │ (@mcp/github) │ │ (eBPF Container)       │
   └──────────────────────┘ └───────────────┘ └────────────────────────┘
```

---

## 🚀 Local Installation & Setup Guide

This project is fully self-contained and ready to run locally on your machine.

### Prerequisites

- **Node.js:** v22.0.0 or higher
- **Package Manager:** `npm` or `pnpm`
- **TrueForge Harness:** `npx @truefoundry/trueforge`

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/truegrant-ai.git
cd truegrant-ai
```

### Step 2: Configure Environment Variables

Copy the sample environment file in the `backend` directory:

```bash
cp backend/.env.example backend/.env
```

Define your keys inside `backend/.env`:

```env
PORT=3000
TRUEFORGE_URL=http://localhost:8790
OPENAI_API_KEY=sk-proj-your-openai-api-key
AWS_REGION=us-east-1
```

### Step 3: Start the TrueForge Agent Harness

In terminal window #1:

```bash
npx @truefoundry/trueforge
```

*Confirms local standalone harness running on `http://localhost:8790`.*

### Step 4: Start the Backend API Server

In terminal window #2:

```bash
cd backend
npm install
node server.js
```

*Backend server runs on `http://localhost:3000` with status endpoint `GET /api/health`.*

### Step 5: Start the React Frontend Dashboard

In terminal window #3:

```bash
cd frontend
npm install
npm run dev
```

*Frontend runs locally on `http://localhost:5173`.*

---

## 🔌 API Reference (`http://localhost:3000`)

TrueGrant AI relies on a centralized `src/api.ts` client that communicates with the Express backend:

- `GET /api/health` — Returns TrueForge Engine latency and connection health.
- `POST /api/scan` — Triggers a TrueForge agent scan across active MCP connectors.
- `GET /api/session/:id` — Fetches current session scan results, sandbox execution logs, and agent state.
- `POST /api/approve` — Submits human decisions (`approve`, `keep`, `snooze`) and writes a SOC 2 audit log.
- `POST /api/rollback` — Triggers the 3-second Emergency Panic Rollback restore from cached encrypted IAM snapshots.

*(Note: If the backend is offline, the UI automatically falls back to seeded local data to guarantee a smooth offline demonstration.)*

---

## 🛡️ Fail-Safe Emergency Rollback Mechanism

In the event that an approved policy revocation disrupts an unforeseen pipeline dependency:
