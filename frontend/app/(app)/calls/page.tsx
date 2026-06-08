"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Clock, Filter, ChevronRight } from "lucide-react";
import Link from "next/link";

const ALL_CALLS = [
  { id: "c1", phone: "+1 (415) 555-0192", agent: "CSAT Agent v2", date: "Apr 11, 2026", time: "2:14 PM", duration: "4m 32s", status: "completed", sentiment: "positive", disposition: "Resolved" },
  { id: "c2", phone: "+1 (628) 555-0144", agent: "CSAT Agent v2", date: "Apr 11, 2026", time: "11:48 AM", duration: "6m 11s", status: "completed", sentiment: "neutral", disposition: "Follow-up required" },
  { id: "c3", phone: "+44 20 7946 0310", agent: "Sales Follow-up", date: "Apr 11, 2026", time: "10:02 AM", duration: "2m 48s", status: "completed", sentiment: "positive", disposition: "Interested" },
  { id: "c4", phone: "+1 (212) 555-0187", agent: "CSAT Agent v2", date: "Apr 10, 2026", time: "4:35 PM", duration: "8m 05s", status: "completed", sentiment: "negative", disposition: "Escalate" },
  { id: "c5", phone: "+1 (510) 555-0223", agent: "Sales Follow-up", date: "Apr 10, 2026", time: "2:20 PM", duration: "3m 14s", status: "completed", sentiment: "positive", disposition: "Callback requested" },
  { id: "c6", phone: "+1 (347) 555-0091", agent: "CSAT Agent v2", date: "Apr 10, 2026", time: "11:05 AM", duration: "5m 58s", status: "interrupted", sentiment: "neutral", disposition: "Follow-up required" },
  { id: "c7", phone: "+1 (917) 555-0038", agent: "CSAT Agent v2", date: "Apr 9, 2026", time: "3:15 PM", duration: "—", status: "no_answer", sentiment: "—", disposition: "—" },
  { id: "c8", phone: "+1 (646) 555-0177", agent: "Sales Follow-up", date: "Apr 9, 2026", time: "1:00 PM", duration: "7m 22s", status: "completed", sentiment: "positive", disposition: "Interested" },
];

const SENTIMENTS = ["all", "positive", "neutral", "negative"];
const STATUSES = ["all", "completed", "interrupted", "no_answer"];

function SentimentBadge({ sentiment }: { sentiment: string }) {
  if (sentiment === "—") return <span className="text-muted-foreground text-xs">—</span>;
  const map: Record<string, string> = {
    positive: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    neutral: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    negative: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${map[sentiment] ?? ""}`}>
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    completed: { label: "Completed", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    interrupted: { label: "Interrupted", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    no_answer: { label: "No answer", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  };
  const s = map[status] ?? { label: status, className: "" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.className}`}>
      {s.label}
    </span>
  );
}

export default function CallHistoryPage() {
  const [search, setSearch] = useState("");
  const [sentiment, setSentiment] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = ALL_CALLS.filter((c) => {
    const matchSearch = c.phone.includes(search) || c.agent.toLowerCase().includes(search.toLowerCase()) || c.disposition.toLowerCase().includes(search.toLowerCase());
    const matchSentiment = sentiment === "all" || c.sentiment === sentiment;
    const matchStatus = status === "all" || c.status === status;
    return matchSearch && matchSentiment && matchStatus;
  });

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Call History</h1>
        <p className="text-muted-foreground text-sm mt-1">{ALL_CALLS.length} calls this month</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by phone, agent, disposition…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-secondary border-border text-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 border border-border rounded-md p-0.5 bg-secondary">
          {SENTIMENTS.map((s) => (
            <button
              key={s}
              onClick={() => setSentiment(s)}
              className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
                sentiment === s
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 border border-border rounded-md p-0.5 bg-secondary">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
                status === s
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "no_answer" ? "No answer" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="bg-card border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Phone</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Agent</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Date & Time</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Duration</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Status</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Sentiment</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Disposition</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-sm">
                  No calls match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((call) => (
                <tr
                  key={call.id}
                  className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/calls/${call.id}`}
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-foreground">{call.phone}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{call.agent}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">
                    <div>{call.date}</div>
                    <div className="text-muted-foreground/60">{call.time}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {call.duration !== "—" && <Clock className="w-3 h-3" />}
                      {call.duration}
                    </span>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={call.status} /></td>
                  <td className="px-5 py-3.5"><SentimentBadge sentiment={call.sentiment} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{call.disposition}</td>
                  <td className="px-5 py-3.5 text-right">
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
