# PRD: Loopback v1 — AI Voice Agent SDK

## Problem Statement

Building AI-powered voice call experiences today requires stitching together telephony providers, real-time audio infrastructure, speech-to-text, text-to-speech, and LLM orchestration — each from different vendors, with no unified interface. Existing platforms like Vapi or Bland.ai abstract this away but trap developers inside a SaaS model: you rent their infrastructure, follow their constraints, and pay their margins. There is no open, embeddable SDK that lets developers own the full voice agent stack while keeping the integration surface minimal.

Beyond infrastructure, there is a second problem: AI voice agents have no natural guardrails. Without a structured way to scope a call to a specific agenda, agents go off-topic, hallucinate, or fail to cover what matters. There is no standard pattern for turning a document — a project brief, a CSAT guide, a research agenda — into a bounded, purposeful conversation.

## Solution

Loopback is an open-source Python SDK that makes it trivial to run structured AI voice calls. The developer provides a document (the call's agenda and context) and a phone number. Loopback pre-distills the document into a structured call guide using Claude, initiates an outbound call via Twilio, runs a real-time voice conversation using LiveKit with Deepgram (STT) and Cartesia (TTS), and returns a structured JSON summary when the call ends.

Claude Code acts as the control room — triggering calls and receiving output via an MCP server. The SDK is fully BYOK (Bring Your Own Keys): developers supply their own credentials for each service and own their infrastructure entirely.

The first validated use case is CSAT calls: after a project delivery, Loopback calls customers, collects structured feedback against a project brief, and returns sentiment, agenda coverage, and a summary — ready to act on.

## User Stories

1. As a developer, I want to install Loopback with a single pip command, so that I can get started without a complex setup process.
2. As a developer, I want to configure all service credentials via a `.env` file, so that I never have to hardcode API keys.
3. As a developer, I want sensible defaults for all settings, so that I can make my first call with minimal configuration.
4. As a developer, I want to pass a document path to the SDK, so that the call agenda is automatically derived from that document.
5. As a developer, I want the SDK to pre-distill my document into a structured call guide before the call starts, so that there is no latency during the live conversation.
6. As a developer, I want the call guide to define the agent's guardrails, so that the agent cannot go off-topic or outside the scope of my document.
7. As a developer, I want to initiate an outbound call with a single function call (`loopback.initCall()`), so that I can trigger calls programmatically from any Python application.
8. As a developer, I want a pre-call confirmation step that shows me the phone number, document, and voice settings before dialing, so that I can catch mistakes before the call fires.
9. As a developer, I want to receive a session ID when a call is initiated, so that I can track and query the call programmatically.
10. As a developer, I want to query call status using the session ID, so that I know whether a call is in progress, completed, or failed.
11. As a developer, I want to retrieve structured JSON output after a call ends, so that I can use the results in downstream systems without parsing unstructured text.
12. As a developer, I want the JSON output to include a call summary, agenda item coverage, sentiment, and full transcript, so that I have a complete picture of what happened.
13. As a developer, I want agenda coverage to map each item from the call guide to whether it was covered, so that I can see exactly what was and wasn't addressed.
14. As a developer, I want to use Loopback as an MCP server in Claude Code, so that I can trigger and receive calls directly from my AI control room.
15. As a Claude Code user, I want native tools (`init_call`, `get_call_status`, `get_call_output`) available in my Claude Code session, so that I can orchestrate calls conversationally.
16. As a CLI user, I want to run `loopback call --phone +1234 --doc brief.pdf` from the terminal, so that I can trigger calls without writing code.
17. As a CLI user, I want a `loopback configure` command that walks me through credential setup, so that initial configuration is guided and error-proof.
18. As an operator, I want the agent to use my document as its only source of truth, so that the conversation stays on-topic and professional.
19. As an operator, I want the agent to speak naturally and handle interruptions gracefully, so that the call feels like a real conversation, not a script.
20. As an operator, I want the agent to end the call cleanly when the agenda is complete, so that calls don't run indefinitely.
21. As an operator running CSAT calls, I want the output to include customer sentiment per agenda item, so that I can identify specific areas of satisfaction or concern.
22. As an operator, I want to swap TTS voice profiles in config, so that I can match the voice to my brand or use case.
23. As an open source contributor, I want the SDK to have a clean module interface, so that I can add new telephony providers (e.g. Telenex) without touching core logic.
24. As an open source contributor, I want the STT and TTS layers to be swappable, so that I can contribute alternative providers without rewriting the agent.
25. As a developer building a CRM, I want to install Loopback as a dependency and call it from my existing Python app, so that I can add voice capabilities without rebuilding infrastructure.
26. As a developer, I want all modules to have comprehensive test coverage, so that I can confidently extend the SDK without breaking existing behavior.

## Implementation Decisions

### Modules

**`loopback.config`**
- Loads and validates all credentials from environment variables
- Manages default values for voice, output format, and call behavior
- Raises clear errors on missing required credentials at startup, not mid-call
- Single source of truth — all other modules receive config from here

**`loopback.document`**
- Accepts input formats: plain text, markdown, PDF
- Uses Claude to distill the document into a structured markdown call guide
- Call guide schema: Objective, Key Facts, Agenda Items, Guardrails, Success Criteria
- Document size constraint for v1: 2–5 pages recommended
- Output is a validated markdown string passed directly to the agent

**`loopback.agent`**
- Built on LiveKit Agents framework (Python)
- Connects to a LiveKit room provisioned by the orchestrator
- Receives the compiled call guide as its system prompt
- STT: Deepgram (streaming, real-time)
- LLM: Claude (Anthropic API)
- TTS: Cartesia
- Ends the call when agenda is complete or maximum duration is reached

**`loopback.orchestrator`**
- Entry point for initiating a call
- Flow: validate config → distill document → provision LiveKit room → dial via Twilio → launch agent → monitor for completion → trigger output processing
- Returns a session ID on initiation
- Stores session state (status, transcript) in memory for v1

**`loopback.output`**
- Triggered after call ends and transcript is available
- Uses Claude to generate: summary, per-agenda-item coverage, overall sentiment, raw transcript array
- Returns structured JSON conforming to a fixed schema

```json
{
  "call_summary": "string",
  "agenda_coverage": [
    { "item": "string", "status": "covered | skipped", "response_summary": "string" }
  ],
  "sentiment": "positive | neutral | negative",
  "outcome": "string",
  "transcript": [
    { "speaker": "agent | customer", "text": "string", "timestamp": "number" }
  ]
}
```

**`loopback.mcp`**
- MCP server exposing three tools to Claude Code:
  - `init_call(phone, document_path, overrides?)` → session_id
  - `get_call_status(session_id)` → status
  - `get_call_output(session_id)` → JSON output
- Started via `loopback mcp` CLI command

**`loopback.cli`**
- Commands: `loopback call`, `loopback configure`, `loopback status`
- `loopback call` surfaces pre-call confirmation before dialing
- Thin wrapper around the Python SDK — no logic of its own

### Architecture Flow

```
Claude Code / CLI
      │
      ▼
loopback.mcp / loopback.cli
      │
      ▼
loopback.orchestrator
      ├── loopback.document  →  Call Guide (markdown)
      ├── Twilio             →  Outbound dial
      └── LiveKit Room       →  loopback.agent
                                    ├── Deepgram (STT)
                                    ├── Claude (LLM)
                                    └── Cartesia (TTS)
      │
      ▼
loopback.output  →  JSON result  →  Claude Code / caller
```

### Key Technical Notes
- Twilio Media Streams connects to LiveKit via standard bridge pattern
- Claude model: `claude-sonnet-4-6` for document distillation and post-call output processing
- Session state is in-memory for v1 — single process assumption
- All credentials loaded from `.env` at startup; never stored in SDK state

## Testing Decisions

**What makes a good test:** Tests verify external behavior — inputs and outputs at module boundaries — not internal implementation details.

| Module | Test Type | What's Tested |
|---|---|---|
| `loopback.config` | Unit | Valid env loads correctly; missing keys raise specific errors; defaults applied |
| `loopback.document` | Unit | Known input produces expected call guide structure; required schema fields always present |
| `loopback.output` | Unit | Known transcript produces correct JSON shape; sentiment constrained to enum values |
| `loopback.orchestrator` | Integration | Full call lifecycle against Twilio test credentials + LiveKit sandbox |
| `loopback.agent` | Integration | Agent stays within call guide scope; ends call when agenda complete |
| `loopback.mcp` | Integration | All three tools return correct shapes; error states surface correctly |
| `loopback.cli` | Integration | Pre-call confirmation triggers; `configure` writes `.env` correctly |

**Framework:** pytest throughout. No mocking of core service calls in integration tests — use Twilio test credentials and LiveKit sandbox.

## Out of Scope

- Inbound calls
- Real-time mid-call steering from Claude Code
- Multi-language STT/TTS support
- Persistent session storage (database, file system)
- Custom output schemas
- Concurrent multi-call sessions
- Web dashboard or hosted UI
- SaaS or hosted infrastructure mode
- Non-Python SDKs in v1
- Alternative telephony providers beyond Twilio in v1

## Further Notes

- The CSAT use case is the v1 validation target. Document in, structured feedback JSON out — that proves the core loop works.
- Clean module interfaces are essential for open source contributions. Each module should be independently useful and testable so contributors can swap providers without touching core orchestration.
- The MCP server is the primary Claude Code integration surface. CLI exists for terminal operators. SDK exists for developers embedding Loopback in their own products.
