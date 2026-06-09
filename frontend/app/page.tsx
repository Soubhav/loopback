import Link from "next/link";
import {
  Phone,
  Bot,
  Zap,
  BarChart3,
  Key,
  Code2,
  Layers,
  Users,
  CheckCircle2,
  Activity,
  ChevronRight,
  Cpu,
  Globe,
} from "lucide-react";

import VoiceOrb from "@/components/VoiceOrbDynamic";

// ─── Logo mark ──────────────────────────────────────────────────────────────

function LogoMark({ size = 28 }: { size?: number }) {
  // Sinusoidal ribbon-wave ring mark.
  // 18 parametric curves follow a circular path with radial sine-wave variation,
  // each offset by a different phase — creating the woven/braided ribbon appearance.
  // The ring's negative-space star (8 points) emerges naturally from wave nodes.
  // Gradient: magenta (top-right) → cyan (center) → royal blue (bottom-left).
  const cx = 100, cy = 100;
  const N = 18, innerR = 52, outerR = 76;
  const wAmp = 8, wFreq = 8, steps = 72;

  function ribbon(i: number): string {
    const t = i / (N - 1);
    const baseR = innerR + t * (outerR - innerR);
    const phase = t * Math.PI;
    const pts: string[] = [];
    for (let s = 0; s <= steps; s++) {
      const theta = (s / steps) * 2 * Math.PI - Math.PI / 2;
      const r = baseR + wAmp * Math.sin(wFreq * theta + phase);
      const x = (cx + r * Math.cos(theta)).toFixed(2);
      const y = (cy + r * Math.sin(theta)).toFixed(2);
      pts.push(s === 0 ? `M${x} ${y}` : `L${x} ${y}`);
    }
    return pts.join("") + "Z";
  }

  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className="shrink-0">
      <defs>
        <linearGradient id="logo-g" x1="200" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#E879F9" />
          <stop offset="48%"  stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {Array.from({ length: N }, (_, i) => (
        <path
          key={i}
          d={ribbon(i)}
          stroke="url(#logo-g)"
          strokeWidth="1.4"
          strokeOpacity={0.45 + (i / (N - 1)) * 0.55}
          fill="none"
        />
      ))}
    </svg>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between gap-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={34} />
          <span className="font-semibold text-sm tracking-tight">Loopback</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#usecases" className="hover:text-foreground transition-colors">Use cases</a>
          <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <a
            href="mailto:demo@loopback.dev"
            className="lp-glow-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-primary-foreground"
            style={{
              background: "linear-gradient(135deg, #E879F9, #2563EB)",
            }}
          >
            Book a Demo
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-14">

      {/* Dot-grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.28 0.018 264) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      {/* Radial vignette over the grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 35%, oklch(0.08 0.01 264) 75%)",
        }}
      />
      {/* Subtle left-side glow */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, #E879F9 0%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-2 gap-8 items-center">

        {/* ── Left: copy ── */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-mono text-muted-foreground mb-7">
            <span
              className="lp-pulse w-1.5 h-1.5 rounded-full"
              style={{ background: "oklch(0.72 0.15 160)" }}
            />
            v1-alpha · MCP-native · OpenAI Realtime
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.07] mb-5">
            Voice calls,<br />
            <span className="lp-gradient-text">programmatically.</span>
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-9 max-w-[420px]">
            Trigger structured outbound calls from Claude Code or Cursor.
            Define voice agent profiles, pick your pipeline, and receive
            machine-readable call outcomes — all via 17 MCP tools.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <a
              href="mailto:demo@loopback.dev"
              className="lp-glow-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground"
              style={{ background: "linear-gradient(135deg, #E879F9, #2563EB)" }}
            >
              Book a Demo
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-border/70 transition-all"
            >
              How it works
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mono stat row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted-foreground">
            {["3 voice pipelines", "17 MCP tools", "Twilio SIP", "LiveKit Cloud"].map((s, i, arr) => (
              <span key={s} className="flex items-center gap-4">
                {s}
                {i < arr.length - 1 && <span className="opacity-25">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: Three.js Voice Orb ── */}
        <div className="hidden md:block relative h-[560px]">

          {/* Floating tech label — top right */}
          <div className="absolute top-10 right-6 z-10 text-right pointer-events-none select-none">
            <div
              className="text-[9px] uppercase tracking-[0.18em] font-mono mb-1"
              style={{ color: "oklch(0.45 0.015 264)" }}
            >
              Voice Pipeline
            </div>
            <div
              className="text-[11px] font-mono font-medium"
              style={{ color: "oklch(0.72 0.22 290)" }}
            >
              OpenAI Realtime
            </div>
          </div>

          {/* Floating tech label — bottom left */}
          <div className="absolute bottom-14 left-6 z-10 pointer-events-none select-none">
            <div
              className="text-[9px] uppercase tracking-[0.18em] font-mono mb-1.5"
              style={{ color: "oklch(0.45 0.015 264)" }}
            >
              Agent Status
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="lp-pulse w-1.5 h-1.5 rounded-full"
                style={{ background: "oklch(0.72 0.15 160)" }}
              />
              <span
                className="text-[11px] font-mono"
                style={{ color: "oklch(0.72 0.15 160)" }}
              >
                Active · LiveKit SIP room
              </span>
            </div>
          </div>

          {/* Floating tech label — mid left */}
          <div className="absolute top-[45%] left-0 z-10 pointer-events-none select-none">
            <div
              className="text-[9px] uppercase tracking-[0.18em] font-mono mb-1"
              style={{ color: "oklch(0.45 0.015 264)" }}
            >
              Latency
            </div>
            <div
              className="text-[11px] font-mono font-semibold"
              style={{ color: "oklch(0.65 0.18 30)" }}
            >
              &lt; 80ms P99
            </div>
          </div>

          {/* The orb fills the container */}
          <VoiceOrb />
        </div>
      </div>
    </section>
  );
}

function TerminalDemo() {
  return (
    <div
      className="rounded-2xl border border-border overflow-hidden"
      style={{
        background: "oklch(0.08 0.015 264)",
        boxShadow: "0 0 60px oklch(0.62 0.2 264 / 0.12), 0 24px 48px oklch(0 0 0 / 0.4)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-border"
        style={{ background: "oklch(0.10 0.015 264)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.577 0.245 27)" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.75 0.17 60)" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.72 0.15 160)" }} />
        <span className="ml-3 text-xs text-muted-foreground font-mono">Claude Code — Loopback MCP</span>
      </div>

      {/* Content */}
      <div className="p-5 font-mono text-xs leading-relaxed space-y-5">
        {/* Step 1 */}
        <div>
          <p style={{ color: "oklch(0.56 0.02 264)" }}>{"// 1. Create a voice agent profile"}</p>
          <p className="mt-1" style={{ color: "oklch(0.72 0.22 290)" }}>
            Tool: <span style={{ color: "oklch(0.97 0 0)" }}>loopback_create_voice_agent</span>
          </p>
          <div
            className="mt-1.5 rounded-lg p-3 text-[11px] leading-5"
            style={{ background: "oklch(0.11 0.015 264)" }}
          >
            <span style={{ color: "oklch(0.56 0.02 264)" }}>{"{"}</span>
            <br />
            <span className="pl-3">
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;name&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: </span>
              <span style={{ color: "oklch(0.75 0.17 60)" }}>&quot;CSAT Caller&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>,</span>
            </span>
            <br />
            <span className="pl-3">
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;useOpenAiRealtime&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: </span>
              <span style={{ color: "oklch(0.65 0.18 30)" }}>true</span>
            </span>
            <br />
            <span style={{ color: "oklch(0.56 0.02 264)" }}>{"}"}</span>
          </div>
          <p className="mt-1.5">
            <span style={{ color: "oklch(0.56 0.02 264)" }}>↳ </span>
            <span style={{ color: "oklch(0.72 0.15 160)" }}>
              {"{ id: \"683abc42\", status: \"created\" }"}
            </span>
          </p>
        </div>

        {/* Step 2 */}
        <div>
          <p style={{ color: "oklch(0.56 0.02 264)" }}>{"// 2. Place the call"}</p>
          <p className="mt-1" style={{ color: "oklch(0.72 0.22 290)" }}>
            Tool: <span style={{ color: "oklch(0.97 0 0)" }}>loopback_place_call</span>
          </p>
          <div
            className="mt-1.5 rounded-lg p-3 text-[11px] leading-5"
            style={{ background: "oklch(0.11 0.015 264)" }}
          >
            <span style={{ color: "oklch(0.56 0.02 264)" }}>{"{"}</span>
            <br />
            <span className="pl-3">
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;toPhoneNumber&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: </span>
              <span style={{ color: "oklch(0.75 0.17 60)" }}>&quot;+12125551234&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>,</span>
            </span>
            <br />
            <span className="pl-3">
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;agentId&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: </span>
              <span style={{ color: "oklch(0.75 0.17 60)" }}>&quot;683abc42&quot;</span>
            </span>
            <br />
            <span style={{ color: "oklch(0.56 0.02 264)" }}>{"}"}</span>
          </div>
          <p className="mt-1.5">
            <span style={{ color: "oklch(0.56 0.02 264)" }}>↳ </span>
            <span style={{ color: "oklch(0.72 0.15 160)" }}>
              {"{ callId: \"call_8x9y\", status: \"ringing\" }"}
            </span>
          </p>
        </div>

        {/* Status bar */}
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 border border-border"
          style={{ background: "oklch(0.11 0.015 264)" }}
        >
          <span
            className="lp-pulse w-2 h-2 rounded-full shrink-0"
            style={{ background: "oklch(0.72 0.15 160)" }}
          />
          <span style={{ color: "oklch(0.72 0.15 160)" }} className="text-[11px]">
            Call active · OpenAI Realtime · LiveKit SIP
          </span>
          <span className="lp-cursor ml-auto text-muted-foreground">▌</span>
        </div>
      </div>
    </div>
  );
}

// ─── Powered by ──────────────────────────────────────────────────────────────

function PoweredBy() {
  const logos = ["LiveKit", "Twilio", "OpenAI", "Ultravox", "Anthropic", "Deepgram"];
  return (
    <section className="border-y border-border py-8">
      <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        <span className="text-xs text-muted-foreground mr-2">Powered by</span>
        {logos.map((l) => (
          <span key={l} className="text-sm font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors">
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Bot className="w-5 h-5" />,
      title: "Define your agent",
      body: "Create a voice agent profile: first message, persona, instructions, and guardrails. Pick your voice pipeline — OpenAI Realtime, Ultravox, or classic inference.",
    },
    {
      n: "02",
      icon: <Phone className="w-5 h-5" />,
      title: "Place the call via MCP",
      body: "From Claude Code or Cursor, call loopback_place_call. Loopback dials out via Twilio SIP and dispatches your agent into a live LiveKit room.",
    },
    {
      n: "03",
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Receive structured output",
      body: "When the call ends, retrieve the full record: status, duration, transcript, and AI-generated summary with sentiment and disposition.",
    },
  ];

  return (
    <section id="how" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>How it works</SectionLabel>
        <h2 className="text-4xl font-bold tracking-tight mt-3 mb-16 max-w-xl">
          From prompt to phone call in seconds.
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-7 left-[calc(100%+0.5rem)] w-[calc(100%-1rem)] h-px"
                  style={{ background: "linear-gradient(to right, oklch(0.22 0.015 264), transparent)" }}
                />
              )}

              <div
                className="rounded-2xl border border-border p-6 h-full"
                style={{ background: "oklch(0.10 0.012 264)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "oklch(0.62 0.2 264 / 0.12)", color: "oklch(0.72 0.22 290)" }}
                  >
                    {s.icon}
                  </div>
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: "oklch(0.62 0.2 264 / 0.5)" }}
                  >
                    {s.n}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features split ──────────────────────────────────────────────────────────

function Features() {
  const devFeatures = [
    { icon: <Code2 className="w-4 h-4" />, title: "17 MCP tools", body: "Full platform access from Claude Code or Cursor — agents, calls, contacts, DID catalog." },
    { icon: <Globe className="w-4 h-4" />, title: "Streamable HTTP MCP", body: "Hosted multi-tenant MCP server. Connect with a Bearer token — no local setup required." },
    { icon: <Key className="w-4 h-4" />, title: "Org-scoped API keys", body: "Machine auth for automated workflows. Keys are scoped to your organization." },
    { icon: <Layers className="w-4 h-4" />, title: "Three voice pipelines", body: "OpenAI Realtime, Ultravox, or LiveKit Inference. Switch per call or per agent profile." },
    { icon: <Cpu className="w-4 h-4" />, title: "TypeScript + Python", body: "NestJS backend with Swagger docs at /api/docs. Python worker for the LiveKit agent runtime." },
  ];

  const opFeatures = [
    { icon: <Bot className="w-4 h-4" />, title: "Voice agent profiles", body: "Reusable personas with first message, instructions, guardrails, and pipeline config." },
    { icon: <Activity className="w-4 h-4" />, title: "Real-time call tracking", body: "Status from dial through disconnect: pending → ringing → active → completed." },
    { icon: <CheckCircle2 className="w-4 h-4" />, title: "Structured outcomes", body: "AI-generated call summary, sentiment, disposition, and agenda coverage per call." },
    { icon: <BarChart3 className="w-4 h-4" />, title: "Dashboard & analytics", body: "Call history, trend charts, sentiment over time, and calls needing follow-up." },
    { icon: <Users className="w-4 h-4" />, title: "Contacts", body: "Org-level contact records. Associate calls with known people and track history." },
  ];

  return (
    <section id="features" className="py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Features</SectionLabel>
        <h2 className="text-4xl font-bold tracking-tight mt-3 mb-16 max-w-xl">
          Built for the people who build — and the people who operate.
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Developers */}
          <FeatureColumn
            label="For developers"
            accent="oklch(0.72 0.22 290)"
            accentBg="oklch(0.62 0.2 264 / 0.08)"
            items={devFeatures}
          />

          {/* Operators */}
          <FeatureColumn
            label="For operators"
            accent="oklch(0.72 0.15 160)"
            accentBg="oklch(0.72 0.15 160 / 0.07)"
            items={opFeatures}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureColumn({
  label,
  accent,
  accentBg,
  items,
}: {
  label: string;
  accent: string;
  accentBg: string;
  items: { icon: React.ReactNode; title: string; body: string }[];
}) {
  return (
    <div
      className="rounded-2xl border border-border p-7"
      style={{ background: "oklch(0.10 0.012 264)" }}
    >
      <div
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mb-6"
        style={{ background: accentBg, color: accent, border: `1px solid ${accent}30` }}
      >
        {label}
      </div>
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.title} className="flex gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: accentBg, color: accent }}
            >
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5">{item.title}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Use cases ───────────────────────────────────────────────────────────────

function UseCases() {
  const cases = [
    {
      label: "Customer updates",
      accent: "oklch(0.72 0.22 290)",
      accentHex: "#a78bfa",
      icon: <Users className="w-5 h-5" />,
      headline: "Ask customers for an update — automatically.",
      body: "After a delivery, milestone, or support resolution, Loopback calls your customer, asks the right questions, and returns structured feedback. No scheduling. No manual notes.",
      bullets: [
        "Post-project CSAT and NPS calls",
        "Health checks on active accounts",
        "Renewal risk signals, surfaced early",
      ],
      tool: "loopback_place_call",
      args: `{ toPhoneNumber: "+1...",\n  agentId: "csat-agent" }`,
      output: "sentiment · summary · agenda coverage",
    },
    {
      label: "Team check-ins",
      accent: "oklch(0.72 0.15 160)",
      accentHex: "#34d399",
      icon: <Activity className="w-5 h-5" />,
      headline: "Replace recurring status meetings.",
      body: "Define a check-in agent once — blockers, progress, dependencies. Trigger it for your whole team from Claude Code. Get a structured digest back instead of sitting in a call.",
      bullets: [
        "Weekly async standups, without the call",
        "Blocker detection before the sprint ends",
        "Structured digest delivered to your inbox",
      ],
      tool: "loopback_place_call",
      args: `{ toPhoneNumber: "+1...",\n  agentId: "standup-agent" }`,
      output: "blockers · key updates · follow-ups",
    },
    {
      label: "Outreach & discovery",
      accent: "oklch(0.65 0.18 30)",
      accentHex: "#fb923c",
      icon: <Zap className="w-5 h-5" />,
      headline: "Run structured conversations at scale.",
      body: "Discovery calls, onboarding interviews, lead qualification — define the conversation guide once as a voice agent profile, then trigger as many calls as you need from a single command.",
      bullets: [
        "Sales discovery and qualification",
        "Onboarding and intake interviews",
        "Research calls with predefined agendas",
      ],
      tool: "loopback_place_call",
      args: `{ toPhoneNumber: "+1...",\n  agentId: "discovery-agent" }`,
      output: "qualification · next action · transcript",
    },
  ];

  return (
    <section id="usecases" className="py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Use cases</SectionLabel>
        <h2 className="text-4xl font-bold tracking-tight mt-3 mb-4 max-w-xl">
          One command. A real conversation.
        </h2>
        <p className="text-muted-foreground text-lg mb-16 max-w-lg">
          Create a voice agent in Claude Code or Cursor. Point it at a phone number.
          Get structured output back — no meetings, no manual notes.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {cases.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-border p-6 flex flex-col gap-5"
              style={{ background: "oklch(0.10 0.012 264)" }}
            >
              {/* Label + icon */}
              <div className="flex items-center justify-between gap-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${c.accent}18`, color: c.accent }}
                >
                  {c.icon}
                </div>
                <span
                  className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${c.accent}14`, color: c.accent, border: `1px solid ${c.accent}28` }}
                >
                  {c.label}
                </span>
              </div>

              {/* Copy */}
              <div>
                <h3 className="font-semibold text-base mb-2 leading-snug">{c.headline}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
              </div>

              {/* Bullets */}
              <ul className="space-y-1.5">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2
                      className="w-3.5 h-3.5 mt-0.5 shrink-0"
                      style={{ color: c.accent }}
                    />
                    {b}
                  </li>
                ))}
              </ul>

              {/* MCP trigger snippet */}
              <div
                className="rounded-xl p-3.5 font-mono text-[11px] leading-5 mt-auto"
                style={{ background: "oklch(0.07 0.01 264)" }}
              >
                <span style={{ color: "oklch(0.56 0.02 264)" }}>Tool: </span>
                <span style={{ color: c.accent }}>{c.tool}</span>
                <br />
                <span style={{ color: "oklch(0.56 0.02 264)" }}>{"("}</span>
                <span style={{ color: "oklch(0.75 0.17 60)" }}>{c.args}</span>
                <span style={{ color: "oklch(0.56 0.02 264)" }}>{")"}</span>
                <div
                  className="mt-2 pt-2 text-[10px]"
                  style={{ borderTop: "1px solid oklch(0.18 0.012 264)", color: "oklch(0.45 0.015 264)" }}
                >
                  returns → <span style={{ color: "oklch(0.62 0.15 160)" }}>{c.output}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          className="mt-10 text-center text-xs font-mono"
          style={{ color: "oklch(0.42 0.015 264)" }}
        >
          All agents are defined and triggered from{" "}
          <span style={{ color: "oklch(0.72 0.22 290)" }}>Claude Code</span>
          {" "}or{" "}
          <span style={{ color: "oklch(0.72 0.22 290)" }}>Cursor</span>
          {" "}using 17 MCP tools — no web form, no separate dashboard required.
        </p>
      </div>
    </section>
  );
}

// ─── Code demo ───────────────────────────────────────────────────────────────

function CodeDemo() {
  return (
    <section id="demo" className="py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Left: copy */}
        <div>
          <SectionLabel>From Claude Code</SectionLabel>
          <h2 className="text-4xl font-bold tracking-tight mt-3 mb-5">
            Your entire calling workflow lives in your AI IDE.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed mb-8">
            Connect the Loopback MCP server once. After that, place calls,
            manage agents, browse phone numbers, and retrieve outcomes — without
            leaving Claude Code or Cursor.
          </p>

          <ul className="space-y-3">
            {[
              "17 MCP tools covering the full platform",
              "Hosted Streamable HTTP — no local server needed",
              "Bearer token auth with org-scoped API keys",
              "Stdio mode for local dev and testing",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "oklch(0.72 0.22 290)" }} />
                {item}
              </li>
            ))}
          </ul>

          <a
            href="mailto:demo@loopback.dev"
            className="lp-glow-btn inline-flex items-center gap-2 mt-10 px-5 py-2.5 rounded-lg text-sm font-semibold text-primary-foreground"
            style={{
              background: "linear-gradient(135deg, #E879F9, #2563EB)",
            }}
          >
            Book a Demo
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Right: code block */}
        <div
          className="rounded-2xl border border-border overflow-hidden"
          style={{
            background: "oklch(0.08 0.015 264)",
            boxShadow: "0 0 50px oklch(0.62 0.2 264 / 0.1), 0 20px 40px oklch(0 0 0 / 0.35)",
          }}
        >
          {/* Window chrome */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-b border-border"
            style={{ background: "oklch(0.10 0.015 264)" }}
          >
            <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.577 0.245 27)" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.75 0.17 60)" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.72 0.15 160)" }} />
            <span className="ml-3 text-xs text-muted-foreground font-mono">mcp-config.json</span>
          </div>

          <pre
            className="p-5 text-xs leading-6 overflow-x-auto"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            <code>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"{"}</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"  "}</span>
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;mcpServers&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: {"{"}</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"    "}</span>
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;loopback&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: {"{"}</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"      "}</span>
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;type&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: </span>
              <span style={{ color: "oklch(0.75 0.17 60)" }}>&quot;http&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>,</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"      "}</span>
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;url&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: </span>
              <span style={{ color: "oklch(0.75 0.17 60)" }}>&quot;https://mcp.loopback.dev&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>,</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"      "}</span>
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;headers&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: {"{"}</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"        "}</span>
              <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;Authorization&quot;</span>
              <span style={{ color: "oklch(0.56 0.02 264)" }}>: </span>
              <span style={{ color: "oklch(0.75 0.17 60)" }}>&quot;Bearer lb_your_api_key&quot;</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"      }"}</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"    }"}</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"  }"}</span>{"\n"}
              <span style={{ color: "oklch(0.56 0.02 264)" }}>{"}"}</span>
            </code>
          </pre>

          {/* Footer annotation */}
          <div
            className="px-5 py-3 border-t border-border text-xs text-muted-foreground"
            style={{ background: "oklch(0.10 0.015 264)" }}
          >
            Drop this into your{" "}
            <code className="text-foreground">.claude/mcp.json</code>{" "}
            or Cursor MCP settings. Then all 17 tools appear instantly.
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <div
          className="relative rounded-3xl border border-border overflow-hidden px-10 py-16 text-center"
          style={{ background: "oklch(0.10 0.012 264)" }}
        >
          {/* Background glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.62 0.2 264 / 0.1), transparent)",
            }}
          />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground mb-7">
              <span
                className="lp-pulse w-1.5 h-1.5 rounded-full"
                style={{ background: "oklch(0.72 0.15 160)" }}
              />
              Now in early access
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
              Ready to run your first<br />
              <span className="lp-gradient-text">AI voice call?</span>
            </h2>

            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10">
              Book a 30-minute demo. We&apos;ll walk through the setup,
              place a live call, and show you how the structured output works end-to-end.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:demo@loopback.dev"
                className="lp-glow-btn inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-primary-foreground"
                style={{
                  background:
                    "linear-gradient(135deg, #E879F9, #2563EB)",
                }}
              >
                Book a Demo
              </a>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl border border-border text-base text-muted-foreground hover:text-foreground hover:border-border/70 transition-all"
              >
                Create an account
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <LogoMark size={22} />
          <span className="font-semibold text-sm">Loopback</span>
          <span className="text-muted-foreground text-sm mx-2">—</span>
          <span className="text-muted-foreground text-sm">AI voice agent platform</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#usecases" className="hover:text-foreground transition-colors">Use cases</a>
          <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          <a href="mailto:demo@loopback.dev" className="hover:text-foreground transition-colors">Contact</a>
        </nav>

        <p className="text-xs text-muted-foreground/50">© 2026 Loopback</p>
      </div>
    </footer>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs font-semibold uppercase tracking-widest"
      style={{ color: "oklch(0.72 0.22 290)" }}
    >
      {children}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <PoweredBy />
      <HowItWorks />
      <Features />
      <UseCases />
      <CodeDemo />
      <FinalCTA />
      <Footer />
    </div>
  );
}
