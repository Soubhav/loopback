# PRD: Loopback v1 — AI Voice Agent Platform

> **Status:** Backend ~80% complete. Frontend not yet built (placeholder only). Last updated: 2026-06-02.

---

## Problem Statement

Building AI-powered voice call experiences today requires stitching together telephony providers, real-time audio infrastructure, speech-to-text, text-to-speech, and LLM orchestration — each from different vendors, with no unified interface. Existing platforms like Vapi or Bland.ai abstract this away but trap developers inside a SaaS model: you rent their infrastructure, follow their constraints, and pay their margins.

Beyond infrastructure, there is a second problem: AI voice agents have no natural guardrails. Without a structured way to scope a call to a specific agenda, agents go off-topic, hallucinate, or fail to cover what matters. There is no standard pattern for turning a document — a project brief, a CSAT guide, a research agenda — into a bounded, purposeful conversation.

A third problem: the output of a voice call is unstructured. A transcript is not actionable. Leaders and operators need structured outcomes — dispositions, sentiment, agenda coverage — that can feed directly into downstream systems and decisions.

---

## Solution

Loopback is a hosted SaaS platform with an MCP server entry point that makes it trivial to run structured AI voice calls. The user signs up, gets an API key, and connects their AI coding environment (Claude Code, Cursor) to the hosted MCP server using a Bearer token. From there, they create voice agent profiles, trigger outbound calls, and receive structured call records — without ever leaving their AI control room.

Loopback manages all infrastructure (telephony via Twilio + LiveKit SIP, real-time voice via OpenAI Realtime / Ultravox / LiveKit Inference, and call lifecycle tracking). Power users can bring their own LiveKit credentials and SIP trunks (BYOK).

The first validated use case is CSAT calls: after a project delivery, Loopback calls customers, collects structured feedback against a project brief, and returns sentiment, agenda coverage, disposition, and a summary — ready to act on.

---

## Core Design Principles

- **Sell outcomes, not minutes** — pricing is based on connected calls delivered, not raw usage metrics
- **Claude-native** — the primary interface is an AI coding environment via MCP, not a web form
- **Structured output** — every call produces machine-readable JSON, not just a transcript
- **Multi-tenant by default** — every user gets an organization on signup; all resources are org-scoped
- **BYOK-ready** — power users can bring their own LiveKit credentials and SIP trunks

---

## User Stories

1. As a developer, I want to sign up on a dashboard, get an API key, and be live in Claude Code in under 5 minutes.
2. As a developer, I want OTP-based email verification on signup, so my account is protected.
3. As a developer, I want to create organization-scoped voice agent profiles, so I can define reusable STT/LLM/TTS configs and prompts once and reuse them across calls.
4. As a developer, I want to trigger a call from Claude Code with `loopback_place_call(toPhoneNumber, agentId)`, so I can place calls without leaving my workflow.
5. As a developer, I want to receive a call ID when a call is initiated, so I can track the call programmatically.
6. As a developer, I want to poll call status (`loopback_get_call`) and see the full call record when complete.
7. As a developer, I want the agent's first message, persona, system/user prompts, and guardrails all configurable per voice agent profile.
8. As a developer, I want to choose between OpenAI Realtime, Ultravox Realtime, or classic LiveKit Inference as the voice pipeline per call.
9. As a developer, I want to browse the public DID catalog and assign a caller-ID to my outbound calls.
10. As a developer, I want org-scoped API keys so machine workflows can authenticate without my personal JWT.
11. As an operator, I want a dashboard that shows call history, metrics, agent profiles, and usage so I have a complete operational picture.
12. As an operator, I want call recordings stored with a link in the dashboard so I can replay conversations.
13. As an operator, I want structured JSON output for every call — summary, agenda coverage, sentiment, disposition, transcript — so I can build downstream automations on top of it.
14. As an operator, I want email notification when a call completes with a short summary and a link to the dashboard.
15. As an operator, I want no-answer and declined calls to not count against my quota.
16. As an operator, I want to manage organization contacts so I can associate calls with known people.
17. As an open source contributor, I want clean module interfaces so I can add new telephony or voice pipeline providers without touching core logic.

---

## Onboarding Flow

```
1. User signs up at loopback.dev (email + password)
2. User confirms email via OTP (6-digit code, 10-minute TTL)
3. A default organization is created automatically on confirmation
4. User creates an API key via dashboard or MCP tool
5. User connects Claude Code / Cursor to the hosted MCP server:
   Authorization: Bearer lb_<api_key>
6. User is live — all MCP tools available in their AI environment
```

---

## Voice Agent Profile (Schema)

Voice agent profiles are the core configuration unit. They are org-scoped, created once, and reused across calls. Inline `agentConfig` on `POST /calls` merges with the stored profile (inline fields win).

```json
{
  "id": "mongo-object-id",
  "organizationId": "mongo-object-id",
  "createdBy": "mongo-object-id",
  "name": "string",
  "description": "string (optional)",
  "runtimeConfig": {
    "personaName": "string",
    "firstMessage": "string",
    "instructions": "string",
    "systemPrompt": "string",
    "userPrompt": "string",
    "guardrails": ["string"],
    "sttModel": "string",
    "sttLanguage": "string",
    "llmModel": "string",
    "ttsModel": "string",
    "ttsVoice": "string",
    "ttsLanguage": "string",
    "sttExtraKwargs": { "punctuate": true, "numerals": true, "smartFormat": true },
    "llmExtraKwargs": { "temperature": 0.7, "maxTokens": 1024 },
    "ttsExtraKwargs": { "speed": 1.0, "volume": 1.0 },
    "preemptiveGeneration": false,
    "disableNoiseCancellation": false,
    "minEndpointingDelay": 0.5,
    "maxEndpointingDelay": 2.0,
    "useOpenAiRealtime": true,
    "openAiRealtimeModel": "gpt-4o-realtime-preview",
    "openAiRealtimeVoice": "alloy",
    "useUltravoxRealtime": false,
    "ultravoxModel": "fixie-ai/ultravox",
    "ultravoxVoice": "Mark",
    "ultravoxTimeExceededMessage": "string"
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

Exactly one voice pipeline is active per call: `useOpenAiRealtime`, `useUltravoxRealtime`, or neither (classic LiveKit Inference). Both flags true is rejected with a 400.

---

## MCP Tools (Claude Code / Cursor Integration)

The MCP server is a TypeScript package (`mcp-server/`) hosted as a Streamable HTTP server. Clients authenticate with `Authorization: Bearer lb_<api_key>`. All tools are also available in stdio mode for local dev.

| Tool | Description |
|---|---|
| `loopback_get_api_key_context` | Returns `organizationId` and owner for the current API key |
| `loopback_list_organizations` | List organizations the authenticated user belongs to (JWT) |
| `loopback_create_voice_agent` | Create an org voice agent profile |
| `loopback_list_voice_agents` | List all voice agent profiles for the org |
| `loopback_get_voice_agent` | Fetch one voice agent by Mongo id |
| `loopback_list_public_phone_catalog` | List available pooled DIDs with computed E.164 |
| `loopback_list_my_phone_numbers` | List DIDs assigned to this org |
| `loopback_get_phone_number` | Fetch one DID by UUID code |
| `loopback_place_call` | Place an outbound SIP call |
| `loopback_list_calls` | List calls in the org (newest first) |
| `loopback_get_call` | Fetch a single call by Mongo id |
| `loopback_get_inference_models` | List available models for all three voice pipelines |
| `loopback_create_contact` | Create an org-level contact record |
| `loopback_list_contacts` | List contacts for the org |
| `loopback_get_contact` | Fetch one contact by Mongo id |
| `loopback_update_contact` | Update a contact record |
| `loopback_delete_contact` | Delete a contact record |

---

## Call Output Schema

```json
{
  "id": "mongo-object-id",
  "livekitRoomName": "string",
  "livekitRoomSid": "string",
  "livekitSipParticipantId": "string",
  "userId": "mongo-object-id",
  "organizationId": "mongo-object-id",
  "voiceAgentId": "mongo-object-id (optional)",
  "toPhoneNumber": "+E.164",
  "fromPhoneNumber": "+E.164 (optional)",
  "status": "pending | ringing | active | completed | failed",
  "agentConfig": { ... },
  "startedAt": "timestamp (when callee answered)",
  "endedAt": "timestamp",
  "durationSeconds": "number",
  "metadata": { ... },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

> **Not yet implemented:** Post-call AI processing (call summary, agenda coverage, sentiment, disposition, full transcript array, recording URL). The `metadata` field currently captures raw agent session-end data. Structured output processing is a planned next step.

---

## Call Lifecycle

```
POST /organizations/:orgId/calls
  → status: PENDING     (call record created)
  → status: RINGING     (SIP participant dialling, phone ringing)
  → status: ACTIVE      (callee answered, agent session live)
  → status: COMPLETED   (callee hung up or agent ended session)
  → status: FAILED      (SIP dial failed, TwirpError, or room never started)
```

LiveKit webhooks drive all status transitions. The agent posts a `session_ended` event (via `X-Webhook-Secret`) when its session closes, merging arbitrary metadata into the call record.

---

## Voice Pipeline Options

The Python LiveKit worker (`agent/`) supports three mutually exclusive voice pipelines, selected per-call via dispatch metadata:

| Pipeline | How to enable | Notes |
|---|---|---|
| **OpenAI Realtime** (default) | `useOpenAiRealtime: true` (default on) | Speech-to-speech, semantic VAD, lowest latency. Requires `OPENAI_API_KEY` on worker. |
| **Ultravox Realtime** | `useUltravoxRealtime: true` | Bundled STT+LLM+TTS via Ultravox. Requires `ULTRAVOX_API_KEY` on worker. |
| **LiveKit Inference** | Both flags false | Classic STT→LLM→TTS pipeline. Model selection via `sttModel`, `llmModel`, `ttsModel`. |

---

## Architecture

```
User (Claude Code / Cursor / Dashboard)
      │
      ▼
MCP Server (TypeScript — Streamable HTTP or stdio)
  Auth: Bearer lb_<api_key> → OrganizationId resolution
      │
      ▼
NestJS Backend API (TypeScript — port 4000)
  /api/organizations/:orgId/calls       ← place call, list/get calls
  /api/organizations/:orgId/agents      ← CRUD voice agent profiles
  /api/organizations/:orgId/api-keys    ← manage API keys
  /api/organizations/:orgId/contacts    ← contact records
  /api/org/:orgId/phone                 ← DID catalog
  /api/webhooks/livekit                 ← LiveKit server events
  /api/webhooks/agent                   ← Python agent session events
  /api/auth                             ← signup (OTP), login, JWT
  /api/organizations                    ← org management
  /api/admin                            ← AdminJS superadmin panel
      │
      ├── MongoDB (calls, org_voice_agents, users, organizations, api_keys, contacts, ...)
      ├── SecretsService (per-user LiveKit BYOK creds, SIP trunk IDs)
      └── LiveKit SDK (RoomServiceClient, SipClient, AgentDispatchClient)
            │
            ▼
      LiveKit Cloud Room
            ├── SIP Participant (Twilio outbound trunk)
            └── Agent Participant (Python worker)
                  ├── Pipeline: OpenAI Realtime (default)
                  ├── Pipeline: Ultravox Realtime
                  └── Pipeline: LiveKit Inference (STT + LLM + TTS)
```

---

## Backend Modules (NestJS — TypeScript)

**`auth`**
- OTP-based email verification signup (6-digit code, 10-min TTL, `pending_signups` collection)
- Login with bcrypt password check → JWT access + refresh tokens
- Password reset and change flows
- Guards: `JwtAuthGuard`, `JwtOrApiKeyGuard`, `RolesGuard`, `SuperadminOrApiKeyGuard`

**`organization`**
- Multi-tenant workspaces; default org auto-provisioned on user creation (Mongo transaction)
- Membership roles: `owner`, `manager`
- `ensureMember(userId, orgId)` used across all consumer modules
- Cascade delete: removes org-scoped calls, agents, API keys, tickets, phone assignments

**`agents`**
- Org-scoped voice agent profiles (`org_voice_agents` collection)
- Full CRUD at `/api/organizations/:orgId/agents`
- Unique name constraint per org (409 on conflict)
- Runtime config merged with per-call `agentConfig` at call time (inline wins)

**`calls`**
- Outbound call placement via LiveKit SIP (`SipClient.createSipParticipant`)
- Agent dispatched via `AgentDispatchClient.createDispatch` with full runtime config in metadata
- Webhook-driven status machine: `PENDING → RINGING → ACTIVE → COMPLETED | FAILED`
- Per-user LiveKit credential resolution with fallback to default project creds

**`webhooks`**
- `POST /api/webhooks/livekit` — signed LiveKit server events (room/participant lifecycle)
- `POST /api/webhooks/agent` — agent session events authenticated by `AGENT_WEBHOOK_SECRET`

**`api-keys`**
- Org-scoped API keys (`api_keys` collection)
- `assertApiKeyOrganizationScope` enforces key → org binding on all consumer routes

**`phone-numbers`**
- DID catalog management: public pooled numbers + org-assigned private numbers
- Operator CRUD at `/api/operator/phone` (superadmin only)
- Consumer read at `/api/org/:orgId/phone/catalog` and `/api/org/:orgId/phone/mine`

**`tickets`**
- Phone number provisioning requests (`tickets` collection, renamed from `requests`)
- Unique pending-reserve constraint per org

**`contacts`**
- Organization-level contact records (`contacts` collection)
- Full CRUD at `/api/organizations/:orgId/contacts`
- Fields: firstName, lastName, phone, countryCode, nationalNumber, email, notes, metadata

**`secrets`**
- Per-user/org credential storage
- Resolves BYOK LiveKit API key/secret and SIP trunk ID, falls back to default env vars

**`notification`**
- Email sending for OTP verification
- Email templates: `otp-verification.html`, `generic-notice.html`
- Call completion emails: planned but not yet wired

**`catalog`**
- `GET /api/inference-models` — LiveKit Inference (LLM/STT/TTS), OpenAI Realtime (models/voices), Ultravox (live API or static fallback)
- Supports type filter: `llm`, `stt`, `tts`, `openai-realtime`, `ultravox`, `realtime`

**`admin`**
- AdminJS panel for superadmin operations
- Phone number entry, user management, org management

**`config`**
- NestJS `ConfigModule` with env validation

---

## Python Agent (`agent/`)

The LiveKit voice worker is a Python package (`src/loopback`, exposed as `agent`) that connects to LiveKit Cloud and handles the real-time voice session.

- **Prewarm**: Silero VAD loaded once per worker process
- **Dispatch metadata**: Full `agentConfig` JSON from backend drives all runtime settings
- **Voice pipelines**: OpenAI Realtime (default), Ultravox Realtime, LiveKit Inference
- **Outbound flow**: Waits for SIP callee audio to be ready before starting the session
- **Noise cancellation**: `ai_coustics` plugin (toggleable via `disableNoiseCancellation`)
- **Session lifecycle**: POSTs `session_started` / `session_ended` events to backend webhook
- **Sample configs**: `sample-agent-configurations/` for property listing, cold calling, etc.

---

## Tech Stack (Actual)

| Layer | Tool |
|---|---|
| Telephony | Twilio (outbound SIP trunk) |
| Real-time audio orchestration | LiveKit Cloud |
| Voice pipeline — default | OpenAI Realtime API |
| Voice pipeline — option 2 | Ultravox Realtime |
| Voice pipeline — option 3 (classic) | LiveKit Inference (configurable STT/LLM/TTS) |
| Agent runtime | Python + LiveKit Agents SDK |
| Claude Code / Cursor integration | MCP Server (TypeScript — Streamable HTTP + stdio) |
| Backend | NestJS (TypeScript) — port 4000 |
| Frontend | React + Vite (TypeScript) — port 5173 (placeholder only) |
| Database | MongoDB (Mongoose) |
| Auth | JWT (access + refresh) + OTP email verification |
| Admin panel | AdminJS |
| Monorepo tooling | Turborepo + pnpm workspaces |
| Containerization | Docker + Docker Compose (backend, frontend, agent, Mongo, Redis) |

---

## What's Built vs. What Remains

### ✅ Implemented

- Full auth flow: OTP email signup, login, JWT, password reset
- Multi-tenant organizations with default org on signup
- Voice agent profiles: org-scoped CRUD, runtime config, per-call merge
- Outbound call placement via LiveKit SIP + Twilio
- Three voice pipelines: OpenAI Realtime (default), Ultravox, LiveKit Inference
- Call lifecycle tracking via LiveKit webhooks (pending → ringing → active → completed/failed)
- Agent session lifecycle webhook (session_started, session_ended with metadata)
- Org-scoped API keys for machine authentication
- MCP server: 17 tools, hosted Streamable HTTP + stdio, Bearer token auth
- Phone number (DID) catalog: public pooled + org-assigned
- Phone provisioning tickets
- Contacts module (org-scoped contact records)
- Inference models catalog endpoint (LiveKit, OpenAI Realtime, Ultravox)
- AdminJS superadmin panel
- Docker Compose full-stack setup (backend + frontend + agent + Mongo + Redis)

### 🚧 Not Yet Built (Frontend — highest priority)

- **Dashboard home** — call metrics, sentiment trends, call volume charts, calls needing follow-up
- **Call history** — paginated, filterable list
- **Call detail** — summary, transcript, sentiment, disposition, recording player
- **Agent library** — grid of saved agent profiles, create/edit/duplicate/delete
- **Account & settings** — API key management, BYOK config, notification preferences
- **Auth pages** — signup, login, OTP verification, password reset

### 🚧 Not Yet Built (Backend)

- **Post-call structured output processing** — AI-generated call summary, agenda coverage analysis, sentiment scoring, disposition inference, full transcript array (the `loopback.output` module from original design)
- **Call completion email notifications** — notification service exists but not wired to call completion
- **Recording storage** — S3 integration, 30-day retention, recording URL in call record
- **Pricing / quota system** — plan-based call limits, billing rules for no-answer/partial calls

---

## Dashboard Pages (To Build)

### Dashboard (Home)
**Metrics (top row):**
- Total calls this month
- Completion rate (%)
- Average sentiment breakdown (positive / neutral / negative)
- Agenda completion rate (%)

**Trend charts:**
- Sentiment over time (line chart)
- Call volume over time (bar chart)

**Calls needing follow-up** — calls with negative sentiment or low agenda coverage

**Recent calls** — last 10 calls with status, agent used, disposition, sentiment

### Call History
- Full paginated list of all calls
- Filterable by: agent, status, sentiment, disposition, date range
- Each row: phone, agent name, date, duration, disposition, sentiment

### Call Detail
- Summary, sentiment, disposition, next action
- Agenda coverage table (item by item)
- Full transcript (speaker-labeled, timestamped)
- Recording player (if available, within 30-day window)

### Agent Library
- Grid of saved voice agent profiles
- Each card: name, description, last used, total calls, avg sentiment
- Actions: use, edit, duplicate, delete

### Account & Settings
- API key management (create, copy, revoke, regenerate)
- BYOK overrides: LiveKit credentials, SIP trunk ID
- Notification settings: email address, preferences
- Plan & usage: calls used this month, upgrade CTA

---

## Notification Flow (Planned)

1. Call ends → `session_ended` webhook updates call record
2. Post-call AI processing generates structured JSON (not yet built)
3. Email sent to user:
   - Subject: `Call with [+1234] completed — [disposition]`
   - Body: 2–3 sentence summary + sentiment + agenda completion rate
   - CTA: Link to call detail page on dashboard
4. `loopback_get_call(callId)` in MCP returns the full call record

---

## Pricing Model (Planned — Not Implemented)

Pricing is outcome-based — users buy bundles of connected calls, not minutes.

| Plan | Calls/month | Features |
|---|---|---|
| Starter | 25 | Dashboard, email notifications, default agents, 30-day recording retention |
| Growth | 150 | + BYOK keys, Slack notifications, priority support |
| Enterprise | Custom | + Custom retention, SSO, SLA, dedicated support |

**Billing rules:**
- No answer / declined / failed to connect → free, no quota consumed
- Call connected but interrupted → charged proportionally by connected minutes
- Call completed → counts as one call against quota

---

## Out of Scope (v1)

- Inbound calls
- Real-time mid-call steering from Claude Code
- Multi-language STT/TTS support
- Custom output schemas
- Concurrent multi-call sessions (single process assumption)
- Alternative telephony providers beyond Twilio
- Slack notifications (v1.5)
- Mobile app / push notifications (v2)
- Longer recording retention tiers (Enterprise v2)
- npx install flow (replaced by hosted Streamable HTTP MCP)

---

## Further Notes

- The CSAT use case is the v1 validation target. Voice agent profile + outbound call → structured outcome JSON — that proves the core loop works. The missing piece is the post-call AI processing step.
- The frontend is the immediate next priority. The backend provides everything the UI needs via REST API (`/api/docs` Swagger available).
- The MCP server is production-ready for developer workflows. It already supports the full call placement and agent management flow.
- Every design decision should default to: what does the operator need to act on this? Not: what's interesting technically.
