# Loopback — AI Voice Agent SDK

## What This Is
Loopback is an open-source Python SDK that lets you run structured AI voice calls over the phone. You provide a document (the agenda and context), a phone number, and Loopback handles the rest — making the call, running the conversation within guardrails, and returning a structured JSON summary when the call ends.

Claude Code acts as the control room: it triggers calls via an MCP server and receives output directly in context.

## Core Design Decisions
- **Outbound calls only** (v1)
- **BYOK** — developers bring their own API keys for all services
- **Document → Call Guide** — documents are pre-distilled into a structured markdown call guide by Claude before the call starts. No RAG, no mid-call lookups.
- **Passive orchestration** — Claude Code triggers the call and receives the output. The agent runs autonomously during the call.
- **Output format** — structured JSON: summary, agenda coverage, sentiment, full transcript

## Tech Stack
| Layer | Tool |
|---|---|
| Telephony | Twilio (outbound) |
| Real-time audio | LiveKit Agents |
| STT | Deepgram |
| TTS | Cartesia |
| LLM | Claude (Anthropic) |
| Claude Code integration | MCP Server |
| Language | Python |

## Modules
- `loopback.document` — distills input documents into structured call guides
- `loopback.agent` — LiveKit voice agent, runs the conversation within guardrails
- `loopback.orchestrator` — manages full call lifecycle (dial, run, teardown)
- `loopback.output` — post-processes transcripts into structured JSON
- `loopback.config` — loads and validates BYOK credentials and defaults
- `loopback.mcp` — MCP server exposing tools to Claude Code
- `loopback.cli` — CLI wrapper (`loopback call`, `loopback configure`)

## What's Out of Scope (v1)
- Inbound calls
- Real-time mid-call steering from Claude Code
- Multi-language support
- RAG / live document lookups during calls
- Hosted/SaaS mode — this is always SDK-first

## First Use Case
CSAT calls — agent calls customers post-project, collects structured feedback mapped to a project brief.
