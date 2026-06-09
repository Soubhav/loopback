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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Logo mark ──────────────────────────────────────────────────────────────

function LogoMark({ size = 28 }: { size?: number }) {
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
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark size={32} />
          <span className="font-semibold text-sm tracking-tight">Loopback</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm text-muted-foreground">
          {[
            { label: "How it works", href: "#how" },
            { label: "Features",     href: "#features" },
            { label: "Use cases",    href: "#usecases" },
            { label: "Demo",         href: "#demo" },
          ].map(({ label, href }) => (
            <Button key={href} variant="ghost" size="sm" render={<a href={href} />}>
              {label}
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button size="sm" className="lp-glow-btn" style={{ background: "linear-gradient(135deg,#E879F9,#2563EB)" }} render={<a href="mailto:demo@loopback.dev" />}>
            Book a Demo <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-14">
      {/* Dot-grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, oklch(0.28 0.018 264) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 35%, oklch(0.08 0.01 264) 75%)" }}
      />
      <div
        className="pointer-events-none absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full opacity-20"
        style={{ background: "radial-gradient(ellipse at center,#E879F9 0%,transparent 70%)", filter: "blur(72px)" }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 grid md:grid-cols-2 gap-8 items-center">
        {/* Left */}
        <div className="space-y-8">
          <div className="space-y-5">
            <Badge variant="outline" className="gap-1.5 font-mono text-xs">
              <span className="lp-pulse w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              v1-alpha · MCP-native · OpenAI Realtime
            </Badge>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.07]">
              Voice calls,<br />
              <span className="lp-gradient-text">programmatically.</span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-[420px]">
              Trigger structured outbound calls from Claude Code or Cursor.
              Define voice agent profiles, pick your pipeline, and receive
              machine-readable outcomes — all via 17 MCP tools.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="lp-glow-btn font-semibold"
              style={{ background: "linear-gradient(135deg,#E879F9,#2563EB)" }}
              render={<a href="mailto:demo@loopback.dev" />}
            >
              Book a Demo
            </Button>
            <Button size="lg" variant="outline" render={<a href="#how" />}>
              How it works <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["3 voice pipelines", "17 MCP tools", "Twilio SIP", "LiveKit Cloud"].map((s) => (
              <Badge key={s} variant="secondary" className="font-mono text-xs">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        {/* Right: Three.js Voice Orb */}
        <div className="hidden md:block relative h-[560px]">
          <div className="absolute top-10 right-6 z-10 text-right pointer-events-none select-none">
            <p className="text-[9px] uppercase tracking-[0.18em] font-mono text-muted-foreground/50 mb-1">Voice Pipeline</p>
            <p className="text-[11px] font-mono font-medium" style={{ color: "oklch(0.72 0.22 290)" }}>OpenAI Realtime</p>
          </div>
          <div className="absolute bottom-14 left-6 z-10 pointer-events-none select-none">
            <p className="text-[9px] uppercase tracking-[0.18em] font-mono text-muted-foreground/50 mb-1.5">Agent Status</p>
            <div className="flex items-center gap-1.5">
              <span className="lp-pulse w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span className="text-[11px] font-mono text-emerald-400">Active · LiveKit SIP room</span>
            </div>
          </div>
          <div className="absolute top-[45%] left-0 z-10 pointer-events-none select-none">
            <p className="text-[9px] uppercase tracking-[0.18em] font-mono text-muted-foreground/50 mb-1">Latency</p>
            <p className="text-[11px] font-mono font-semibold text-amber-400">&lt; 80ms P99</p>
          </div>
          <VoiceOrb />
        </div>
      </div>
    </section>
  );
}

// ─── Powered by ──────────────────────────────────────────────────────────────

function PoweredBy() {
  const logos = ["LiveKit", "Twilio", "OpenAI", "Ultravox", "Anthropic", "Deepgram"];
  return (
    <div className="border-y border-border py-7">
      <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <span className="text-xs text-muted-foreground/60 font-mono mr-2">Powered by</span>
        {logos.map((l) => (
          <span key={l} className="text-sm font-semibold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors tracking-wide">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Bot className="w-5 h-5" />,
      title: "Define your agent",
      body: "Create a voice agent profile in Claude Code: first message, persona, instructions, and guardrails. No web form — all via MCP tools.",
    },
    {
      n: "02",
      icon: <Phone className="w-5 h-5" />,
      title: "Place the call via MCP",
      body: "Call loopback_place_call from Claude Code or Cursor. Loopback dials out via Twilio SIP and dispatches your agent into a live LiveKit room.",
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
        <h2 className="text-4xl font-bold tracking-tight mt-3 mb-4">
          From prompt to phone call in seconds.
        </h2>
        <p className="text-muted-foreground text-base mb-14 max-w-lg">
          Three steps. No infrastructure to manage. No separate dashboard to open.
        </p>

        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-8 left-[calc(100%+0.75rem)] w-[calc(100%-1.5rem)] h-px z-10"
                  style={{ background: "linear-gradient(to right, oklch(0.28 0.018 264), transparent)" }}
                />
              )}
              <Card className="h-full border-border/60 bg-card/60">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "oklch(0.62 0.2 264 / 0.12)", color: "oklch(0.72 0.22 290)" }}
                    >
                      {s.icon}
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground/50">{s.n}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mb-2">{s.title}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ────────────────────────────────────────────────────────────────

function Features() {
  const devFeatures = [
    { icon: <Code2 className="w-4 h-4" />,   title: "17 MCP tools",          body: "Full platform access from Claude Code or Cursor — agents, calls, contacts, DID catalog." },
    { icon: <Globe className="w-4 h-4" />,   title: "Streamable HTTP MCP",   body: "Hosted multi-tenant MCP server. Connect with a Bearer token — no local setup required." },
    { icon: <Key className="w-4 h-4" />,     title: "Org-scoped API keys",   body: "Machine auth for automated workflows. Keys are scoped to your organization." },
    { icon: <Layers className="w-4 h-4" />,  title: "Three voice pipelines", body: "OpenAI Realtime, Ultravox, or LiveKit Inference. Switch per call or per agent profile." },
    { icon: <Cpu className="w-4 h-4" />,     title: "TypeScript + Python",   body: "NestJS backend with Swagger docs at /api/docs. Python worker for the LiveKit agent runtime." },
  ];

  const opFeatures = [
    { icon: <Bot className="w-4 h-4" />,          title: "Voice agent profiles",    body: "Reusable personas with first message, instructions, guardrails, and pipeline config." },
    { icon: <Activity className="w-4 h-4" />,     title: "Real-time call tracking", body: "Status from dial through disconnect: pending → ringing → active → completed." },
    { icon: <CheckCircle2 className="w-4 h-4" />, title: "Structured outcomes",     body: "AI-generated call summary, sentiment, disposition, and agenda coverage per call." },
    { icon: <BarChart3 className="w-4 h-4" />,    title: "Dashboard & analytics",   body: "Call history, trend charts, sentiment over time, and calls needing follow-up." },
    { icon: <Users className="w-4 h-4" />,        title: "Contacts",                body: "Org-level contact records. Associate calls with known people and track history." },
  ];

  return (
    <section id="features" className="py-28">
      <Separator className="mb-28" />
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Features</SectionLabel>
        <h2 className="text-4xl font-bold tracking-tight mt-3 mb-4 max-w-xl">
          Built for the people who build — and the people who operate.
        </h2>
        <p className="text-muted-foreground text-base mb-14 max-w-lg">
          Developers get MCP tools and full pipeline control. Operators get structured outcomes and a dashboard.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          <FeatureCard label="For developers" accent="oklch(0.72 0.22 290)" accentBg="oklch(0.62 0.2 264 / 0.08)" items={devFeatures} />
          <FeatureCard label="For operators"  accent="oklch(0.72 0.15 160)" accentBg="oklch(0.72 0.15 160 / 0.07)" items={opFeatures} />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  label, accent, accentBg,
  items,
}: {
  label: string; accent: string; accentBg: string;
  items: { icon: React.ReactNode; title: string; body: string }[];
}) {
  return (
    <Card className="border-border/60 bg-card/60">
      <CardHeader>
        <Badge
          variant="outline"
          className="w-fit text-xs font-semibold"
          style={{ background: accentBg, color: accent, borderColor: `${accent}30` }}
        >
          {label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-5">
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
      </CardContent>
    </Card>
  );
}

// ─── Use cases ───────────────────────────────────────────────────────────────

function UseCases() {
  const cases = [
    {
      value: "customer",
      trigger: "Customer updates",
      accent: "oklch(0.72 0.22 290)",
      icon: <Users className="w-5 h-5" />,
      headline: "Ask customers for an update — automatically.",
      body: "After a delivery, milestone, or support resolution, Loopback calls your customer, asks the right questions, and returns structured feedback. No scheduling. No manual notes.",
      bullets: ["Post-project CSAT and NPS calls", "Health checks on active accounts", "Renewal risk signals, surfaced early"],
      args: `{ toPhoneNumber: "+12125551234",\n  agentId: "csat-agent" }`,
      output: [
        { label: "sentiment",       value: "positive" },
        { label: "summary",         value: "Customer satisfied, flagged doc quality" },
        { label: "agenda_coverage", value: "4 / 4 items" },
      ],
    },
    {
      value: "team",
      trigger: "Team check-ins",
      accent: "oklch(0.72 0.15 160)",
      icon: <Activity className="w-5 h-5" />,
      headline: "Replace recurring status meetings.",
      body: "Define a check-in agent once — blockers, progress, dependencies. Trigger it for your whole team from Claude Code. Get a structured digest back instead of sitting in a call.",
      bullets: ["Weekly async standups, without the call", "Blocker detection before the sprint ends", "Structured digest delivered to your inbox"],
      args: `{ toPhoneNumber: "+12125559876",\n  agentId: "standup-agent" }`,
      output: [
        { label: "blockers",   value: "1 flagged — auth service delay" },
        { label: "updates",    value: "Sprint 80% complete" },
        { label: "followups",  value: "2 action items created" },
      ],
    },
    {
      value: "outreach",
      trigger: "Outreach & discovery",
      accent: "oklch(0.65 0.18 30)",
      icon: <Zap className="w-5 h-5" />,
      headline: "Run structured conversations at scale.",
      body: "Discovery calls, onboarding interviews, lead qualification — define the conversation guide once as a voice agent profile, then trigger as many calls as you need from a single command.",
      bullets: ["Sales discovery and qualification", "Onboarding and intake interviews", "Research calls with predefined agendas"],
      args: `{ toPhoneNumber: "+12125550011",\n  agentId: "discovery-agent" }`,
      output: [
        { label: "qualified",    value: "true" },
        { label: "next_action",  value: "Schedule technical call" },
        { label: "disposition",  value: "warm" },
      ],
    },
  ];

  return (
    <section id="usecases" className="py-28">
      <Separator className="mb-28" />
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>Use cases</SectionLabel>
        <h2 className="text-4xl font-bold tracking-tight mt-3 mb-4">
          One command. A real conversation.
        </h2>
        <p className="text-muted-foreground text-base mb-12 max-w-lg">
          Create a voice agent in Claude Code or Cursor. Point it at a phone number.
          Get structured output back — no meetings, no manual notes.
        </p>

        <Tabs defaultValue="customer">
          <TabsList className="mb-8 h-auto p-1 gap-1 flex-wrap">
            {cases.map((c) => (
              <TabsTrigger key={c.value} value={c.value} className="gap-2 data-[state=active]:shadow-sm">
                <span style={{ color: "inherit" }}>{c.icon}</span>
                {c.trigger}
              </TabsTrigger>
            ))}
          </TabsList>

          {cases.map((c) => (
            <TabsContent key={c.value} value={c.value}>
              <Card className="border-border/60 bg-card/60 overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left: description */}
                  <CardContent className="p-8 space-y-6">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: `${c.accent}18`, color: c.accent }}
                    >
                      {c.icon}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3 leading-snug">{c.headline}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{c.body}</p>
                    </div>

                    <ul className="space-y-2">
                      {c.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: c.accent }} />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  {/* Right: code + output */}
                  <div
                    className="p-8 space-y-5 border-l border-border/40"
                    style={{ background: "oklch(0.07 0.01 264)" }}
                  >
                    {/* MCP call */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-3">
                        Claude Code · MCP tool call
                      </p>
                      <div className="rounded-xl border border-border/40 p-4 font-mono text-[12px] leading-6" style={{ background: "oklch(0.085 0.012 264)" }}>
                        <span style={{ color: "oklch(0.56 0.02 264)" }}>Tool: </span>
                        <span style={{ color: c.accent }}>loopback_place_call</span>
                        <br />
                        <span style={{ color: "oklch(0.56 0.02 264)" }}>(</span>
                        <span style={{ color: "oklch(0.75 0.17 60)" }}>{c.args}</span>
                        <span style={{ color: "oklch(0.56 0.02 264)" }}>)</span>
                      </div>
                    </div>

                    {/* Structured output */}
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 mb-3">
                        Structured output
                      </p>
                      <div className="rounded-xl border border-border/40 p-4 font-mono text-[12px] leading-7" style={{ background: "oklch(0.085 0.012 264)" }}>
                        <span style={{ color: "oklch(0.56 0.02 264)" }}>{`{`}</span>
                        {c.output.map(({ label, value }) => (
                          <div key={label} className="pl-4">
                            <span style={{ color: "oklch(0.72 0.15 160)" }}>&quot;{label}&quot;</span>
                            <span style={{ color: "oklch(0.56 0.02 264)" }}>: </span>
                            <span style={{ color: "oklch(0.75 0.17 60)" }}>&quot;{value}&quot;</span>
                          </div>
                        ))}
                        <span style={{ color: "oklch(0.56 0.02 264)" }}>{`}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <p className="mt-8 text-center text-xs font-mono text-muted-foreground/40">
          All agents defined and triggered from{" "}
          <span style={{ color: "oklch(0.72 0.22 290)" }}>Claude Code</span>{" "}or{" "}
          <span style={{ color: "oklch(0.72 0.22 290)" }}>Cursor</span>{" "}
          using 17 MCP tools — no web form required.
        </p>
      </div>
    </section>
  );
}

// ─── Code demo ───────────────────────────────────────────────────────────────

function CodeDemo() {
  return (
    <section id="demo" className="py-28">
      <Separator className="mb-28" />
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <div>
            <SectionLabel>From Claude Code</SectionLabel>
            <h2 className="text-4xl font-bold tracking-tight mt-3 mb-4">
              Your entire calling workflow lives in your AI IDE.
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              Connect the Loopback MCP server once. After that, place calls,
              manage agents, browse phone numbers, and retrieve outcomes — without
              leaving Claude Code or Cursor.
            </p>
          </div>

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

          <Button
            size="lg"
            className="lp-glow-btn font-semibold"
            style={{ background: "linear-gradient(135deg,#E879F9,#2563EB)" }}
            render={<a href="mailto:demo@loopback.dev" />}
          >
            Book a Demo <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Code block card */}
        <Card className="overflow-hidden border-border/60" style={{ boxShadow: "0 0 50px oklch(0.62 0.2 264 / 0.08), 0 20px 40px oklch(0 0 0 / 0.3)" }}>
          <CardHeader className="py-3 px-4 border-b border-border/60 flex-row items-center gap-2 space-y-0" style={{ background: "oklch(0.10 0.015 264)" }}>
            <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.577 0.245 27)" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.75 0.17 60)" }} />
            <span className="w-3 h-3 rounded-full" style={{ background: "oklch(0.72 0.15 160)" }} />
            <span className="ml-2 text-xs text-muted-foreground font-mono">mcp-config.json</span>
          </CardHeader>
          <CardContent className="p-0">
            <pre className="p-5 text-xs leading-6 overflow-x-auto font-mono">
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
            <div className="px-5 py-3 border-t border-border/60 text-xs text-muted-foreground" style={{ background: "oklch(0.10 0.015 264)" }}>
              Drop this into your{" "}
              <code className="text-foreground font-mono">.claude/mcp.json</code>. All 17 tools appear instantly.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-28">
      <Separator className="mb-28" />
      <div className="mx-auto max-w-6xl px-6">
        <Card
          className="relative overflow-hidden text-center border-border/60 px-8 py-16"
          style={{ background: "oklch(0.10 0.012 264)" }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.62 0.2 264 / 0.09), transparent)" }}
          />
          <CardContent className="relative z-10 space-y-6 p-0">
            <Badge variant="outline" className="gap-1.5 font-mono text-xs mx-auto">
              <span className="lp-pulse w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Now in early access
            </Badge>

            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Ready to run your first<br />
                <span className="lp-gradient-text">AI voice call?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Book a 30-minute demo. We&apos;ll walk through the setup, place a live call,
                and show you how the structured output works end-to-end.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                size="lg"
                className="lp-glow-btn font-semibold"
                style={{ background: "linear-gradient(135deg,#E879F9,#2563EB)" }}
                render={<a href="mailto:demo@loopback.dev" />}
              >
                Book a Demo
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/signup" />}>
                Create an account <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="pb-10">
      <Separator className="mb-10" />
      <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <LogoMark size={22} />
          <span className="font-semibold text-sm">Loopback</span>
          <span className="text-muted-foreground/40 mx-1">—</span>
          <span className="text-muted-foreground text-sm">AI voice agent platform</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-1">
          {[
            { label: "How it works", href: "#how" },
            { label: "Features",     href: "#features" },
            { label: "Use cases",    href: "#usecases" },
          ].map(({ label, href }) => (
            <Button key={href} variant="ghost" size="sm" className="text-muted-foreground" render={<a href={href} />}>
              {label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="text-muted-foreground" render={<Link href="/login" />}>
            Sign in
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground" render={<a href="mailto:demo@loopback.dev" />}>
            Contact
          </Button>
        </nav>

        <p className="text-xs text-muted-foreground/40">© 2026 Loopback</p>
      </div>
    </footer>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "oklch(0.72 0.22 290)" }}>
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
