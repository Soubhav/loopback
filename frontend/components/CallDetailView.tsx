"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  Phone,
  Bot,
  Calendar,
  CheckCircle2,
  XCircle,
  Play,
  Download,
  Copy,
} from "lucide-react";
import Link from "next/link";

// Mock call detail
const CALL = {
  id: "c1",
  phone: "+1 (415) 555-0192",
  agent: "CSAT Agent v2",
  date: "Apr 11, 2026",
  time: "2:14 PM",
  duration: "4m 32s",
  status: "completed",
  sentiment: "positive",
  summary: "Customer expressed strong satisfaction with the project delivery. All key deliverables were acknowledged positively. Minor concern raised about documentation quality — customer requested a follow-up document. Overall tone was appreciative and constructive.",
  disposition: "Resolved",
  next_action: "Send updated documentation within 48 hours.",
  confidence: "high",
  agenda_coverage: [
    { item: "Overall project satisfaction", status: "covered", response: "Very satisfied — noted the team exceeded expectations on timeline." },
    { item: "Quality of deliverables", status: "covered", response: "Positive, with minor note about documentation needing more depth." },
    { item: "Communication during project", status: "covered", response: "Praised responsiveness and weekly updates." },
    { item: "Likelihood to recommend", status: "covered", response: "Confirmed would recommend. Mentioned a colleague at another company." },
    { item: "Areas for improvement", status: "covered", response: "Documentation quality. No other concerns raised." },
  ],
  transcript: [
    { speaker: "agent", text: "Hi, this is Alex from Sigma Studio — I'm calling for a quick feedback check on your recent project. Is now a good time?", timestamp: 0 },
    { speaker: "customer", text: "Oh yes, perfect timing actually. I was just thinking about you guys.", timestamp: 5 },
    { speaker: "agent", text: "Great to hear! I'd love to get your honest thoughts. Starting with the big picture — how satisfied were you with the project overall?", timestamp: 10 },
    { speaker: "customer", text: "Honestly, very satisfied. You guys came in on time, which honestly I didn't expect, and the final product looks great.", timestamp: 16 },
    { speaker: "agent", text: "That's really good to hear. What about the quality of the deliverables themselves — anything that stood out positively or areas you felt could be stronger?", timestamp: 26 },
    { speaker: "customer", text: "The work itself was solid. If I had one note, the handover documentation could've been more detailed. We had to figure a few things out ourselves.", timestamp: 34 },
    { speaker: "agent", text: "Understood — that's useful feedback. Documentation depth is something we can absolutely address. How did you find communication throughout the project?", timestamp: 45 },
    { speaker: "customer", text: "Really good. The weekly check-ins were valuable, and responses were always quick. No complaints there.", timestamp: 52 },
    { speaker: "agent", text: "Glad to hear it. Last question — would you be likely to recommend us to someone in your network?", timestamp: 60 },
    { speaker: "customer", text: "Absolutely. I already mentioned your name to a colleague at another company last week actually.", timestamp: 66 },
    { speaker: "agent", text: "That means a lot — thank you. We'll get you updated documentation within the next couple of days. Really appreciate your time today.", timestamp: 74 },
    { speaker: "customer", text: "Perfect, thanks for calling. Take care.", timestamp: 79 },
  ],
  recording_url: "#",
  recording_expires: "May 11, 2026",
};

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const map: Record<string, string> = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    negative: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${map[sentiment] ?? ""}`}>
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function CallDetailPage() {
  const coveredCount = CALL.agenda_coverage.filter((a) => a.status === "covered").length;
  const coveragePercent = Math.round((coveredCount / CALL.agenda_coverage.length) * 100);

  return (
    <div className="p-8 max-w-[1000px] mx-auto space-y-6">
      {/* Back */}
      <Link href="/calls" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to calls
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-xl font-semibold tracking-tight font-mono">{CALL.phone}</h1>
            <SentimentBadge sentiment={CALL.sentiment} />
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              {CALL.disposition}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Bot className="w-3.5 h-3.5" />{CALL.agent}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{CALL.date} · {CALL.time}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{CALL.duration}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Summary + Outcome */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 p-5 bg-card border-border">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Summary</h3>
          <p className="text-sm text-foreground leading-relaxed">{CALL.summary}</p>
        </Card>
        <Card className="p-5 bg-card border-border space-y-4">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Outcome</h3>
            <p className="text-sm font-medium text-foreground">{CALL.disposition}</p>
            <span className="text-xs text-muted-foreground">Confidence: {CALL.confidence}</span>
          </div>
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Next action</h3>
            <p className="text-sm text-foreground">{CALL.next_action}</p>
          </div>
        </Card>
      </div>

      {/* Agenda coverage */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Agenda coverage</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{coveredCount}/{CALL.agenda_coverage.length} items covered</span>
            <div className="w-24">
              <Progress value={coveragePercent} className="h-1.5" />
            </div>
            <span className="text-xs font-medium text-foreground">{coveragePercent}%</span>
          </div>
        </div>
        <div className="space-y-3">
          {CALL.agenda_coverage.map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
              <div className="mt-0.5 shrink-0">
                {item.status === "covered" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{item.item}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.response}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recording */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Recording</h3>
            <p className="text-xs text-muted-foreground">Expires {CALL.recording_expires} · {CALL.duration}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Play className="w-3.5 h-3.5" />
              Play recording
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {/* Waveform placeholder */}
        <div className="mt-4 h-10 rounded-md bg-secondary border border-border flex items-center px-4 gap-1">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/30 rounded-sm"
              style={{ height: `${Math.random() * 28 + 4}px` }}
            />
          ))}
        </div>
      </Card>

      {/* Transcript */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Transcript</h3>
          <button className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Copy className="w-3 h-3" />
            Copy transcript
          </button>
        </div>
        <div className="space-y-4">
          {CALL.transcript.map((line, i) => (
            <div key={i} className={`flex gap-4 ${line.speaker === "agent" ? "" : "flex-row-reverse"}`}>
              <div className="shrink-0 mt-0.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                  line.speaker === "agent"
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {line.speaker === "agent" ? "A" : "C"}
                </div>
              </div>
              <div className={`max-w-[75%] ${line.speaker === "customer" ? "text-right" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {line.speaker === "agent" ? "Agent" : "Customer"}
                  </span>
                  <span className="text-xs text-muted-foreground/50 font-mono">{formatTime(line.timestamp)}</span>
                </div>
                <div className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  line.speaker === "agent"
                    ? "bg-secondary text-foreground"
                    : "bg-primary/10 text-foreground border border-primary/20"
                }`}>
                  {line.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
