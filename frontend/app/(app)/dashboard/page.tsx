"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Phone,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Clock,
  Bot,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data
const sentimentTrend = [
  { date: "Mar 15", positive: 12, neutral: 4, negative: 2 },
  { date: "Mar 22", positive: 15, neutral: 3, negative: 1 },
  { date: "Mar 29", positive: 10, neutral: 6, negative: 3 },
  { date: "Apr 5", positive: 18, neutral: 4, negative: 2 },
  { date: "Apr 11", positive: 14, neutral: 5, negative: 1 },
];

const callVolume = [
  { date: "Apr 5", calls: 6 },
  { date: "Apr 6", calls: 4 },
  { date: "Apr 7", calls: 8 },
  { date: "Apr 8", calls: 5 },
  { date: "Apr 9", calls: 9 },
  { date: "Apr 10", calls: 3 },
  { date: "Apr 11", calls: 7 },
];

const recentCalls = [
  { id: "c1", phone: "+1 (415) 555-0192", agent: "CSAT Agent v2", time: "2h ago", duration: "4m 32s", sentiment: "positive", disposition: "Resolved" },
  { id: "c2", phone: "+1 (628) 555-0144", agent: "CSAT Agent v2", time: "3h ago", duration: "6m 11s", sentiment: "neutral", disposition: "Follow-up required" },
  { id: "c3", phone: "+44 20 7946 0310", agent: "Sales Follow-up", time: "5h ago", duration: "2m 48s", sentiment: "positive", disposition: "Interested" },
  { id: "c4", phone: "+1 (212) 555-0187", agent: "CSAT Agent v2", time: "Yesterday", duration: "8m 05s", sentiment: "negative", disposition: "Escalate" },
  { id: "c5", phone: "+1 (510) 555-0223", agent: "Sales Follow-up", time: "Yesterday", duration: "3m 14s", sentiment: "positive", disposition: "Callback requested" },
];

const needsFollowUp = [
  { id: "c4", phone: "+1 (212) 555-0187", agent: "CSAT Agent v2", disposition: "Escalate", summary: "Customer frustrated with delivery delay. Needs immediate escalation to ops team." },
  { id: "c6", phone: "+1 (347) 555-0091", agent: "CSAT Agent v2", disposition: "Follow-up required", summary: "3 of 5 agenda items skipped. Customer had to leave early — reschedule needed." },
];

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const map: Record<string, { label: string; className: string }> = {
    positive: { label: "Positive", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    neutral: { label: "Neutral", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
    negative: { label: "Negative", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  };
  const s = map[sentiment] ?? map.neutral;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${s.className}`}>
      {s.label}
    </span>
  );
}

const CustomTooltipStyle = {
  contentStyle: {
    background: "oklch(0.13 0.015 264)",
    border: "1px solid oklch(0.22 0.015 264)",
    borderRadius: "6px",
    fontSize: "12px",
    color: "oklch(0.97 0 0)",
  },
  itemStyle: { color: "oklch(0.97 0 0)" },
  labelStyle: { color: "oklch(0.56 0.02 264)", marginBottom: "4px" },
};

export default function DashboardPage() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">April 2026 · Starter plan</p>
        </div>
        <Link
          href="/agents/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Bot className="w-4 h-4" />
          New Agent
        </Link>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard
          label="Calls this month"
          value="42"
          sub="18 remaining in plan"
          icon={<Phone className="w-4 h-4 text-primary" />}
          trend={{ dir: "up", label: "+12% vs last month" }}
        />
        <KpiCard
          label="Completion rate"
          value="87%"
          sub="37 of 42 completed"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          trend={{ dir: "up", label: "+4% vs last month" }}
        />
        <KpiCard
          label="Positive sentiment"
          value="71%"
          sub="30 of 42 calls"
          icon={<TrendingUp className="w-4 h-4 text-primary" />}
          trend={{ dir: "neutral", label: "Stable" }}
        />
        <KpiCard
          label="Agenda completion"
          value="79%"
          sub="Avg across all calls"
          icon={<CheckCircle2 className="w-4 h-4 text-amber-400" />}
          trend={{ dir: "down", label: "-3% vs last month" }}
        />
      </div>

      {/* Plan usage */}
      <Card className="p-5 bg-card border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">Plan usage</span>
          <span className="text-xs text-muted-foreground">24 / 25 calls used</span>
        </div>
        <Progress value={96} className="h-1.5" />
        <p className="text-xs text-amber-400 mt-2">You have 1 call remaining this month. <Link href="/settings#plan" className="underline underline-offset-2">Upgrade plan →</Link></p>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        {/* Sentiment trend */}
        <Card className="col-span-3 p-5 bg-card border-border">
          <h3 className="text-sm font-medium mb-1">Sentiment trend</h3>
          <p className="text-xs text-muted-foreground mb-5">Weekly breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={sentimentTrend} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="positive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.15 160)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.72 0.15 160)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="negative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.577 0.245 27.325)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="oklch(0.577 0.245 27.325)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.015 264)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "oklch(0.56 0.02 264)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.56 0.02 264)" }} axisLine={false} tickLine={false} />
              <Tooltip {...CustomTooltipStyle} />
              <Area type="monotone" dataKey="positive" stroke="oklch(0.72 0.15 160)" fill="url(#positive)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="neutral" stroke="oklch(0.62 0.2 264)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
              <Area type="monotone" dataKey="negative" stroke="oklch(0.577 0.245 27.325)" fill="url(#negative)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-4">
            <LegendDot color="oklch(0.72 0.15 160)" label="Positive" />
            <LegendDot color="oklch(0.62 0.2 264)" label="Neutral" dashed />
            <LegendDot color="oklch(0.577 0.245 27.325)" label="Negative" />
          </div>
        </Card>

        {/* Call volume */}
        <Card className="col-span-2 p-5 bg-card border-border">
          <h3 className="text-sm font-medium mb-1">Call volume</h3>
          <p className="text-xs text-muted-foreground mb-5">Last 7 days</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={callVolume} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.22 0.015 264)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "oklch(0.56 0.02 264)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "oklch(0.56 0.02 264)" }} axisLine={false} tickLine={false} />
              <Tooltip {...CustomTooltipStyle} />
              <Bar dataKey="calls" fill="oklch(0.62 0.2 264)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Needs follow-up */}
      {needsFollowUp.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-medium">Needs follow-up</h3>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">{needsFollowUp.length}</Badge>
          </div>
          <div className="space-y-2">
            {needsFollowUp.map((call) => (
              <Link key={call.id} href={`/calls/${call.id}`}>
                <Card className="p-4 bg-card border-border hover:border-amber-500/30 hover:bg-amber-500/5 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{call.phone}</span>
                        <span className="text-xs text-muted-foreground">· {call.agent}</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {call.disposition}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{call.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent calls */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Recent calls</h3>
          <Link href="/calls" className="text-xs text-primary hover:text-primary/80 transition-colors">
            View all →
          </Link>
        </div>
        <Card className="bg-card border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Phone</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Agent</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Duration</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Sentiment</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Disposition</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentCalls.map((call, i) => (
                <tr
                  key={call.id}
                  className={`border-b border-border last:border-0 hover:bg-secondary/40 transition-colors cursor-pointer`}
                  onClick={() => window.location.href = `/calls/${call.id}`}
                >
                  <td className="px-5 py-3.5 font-mono text-xs text-foreground">{call.phone}</td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">{call.agent}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {call.duration}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <SentimentBadge sentiment={call.sentiment} />
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{call.disposition}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground text-right">{call.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, icon, trend }: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  trend: { dir: "up" | "down" | "neutral"; label: string };
}) {
  const TrendIcon = trend.dir === "up" ? ArrowUpRight : trend.dir === "down" ? ArrowDownRight : Minus;
  const trendColor = trend.dir === "up" ? "text-emerald-400" : trend.dir === "down" ? "text-red-400" : "text-muted-foreground";

  return (
    <Card className="p-5 bg-card border-border">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
      <div className={`flex items-center gap-1 mt-3 text-xs ${trendColor}`}>
        <TrendIcon className="w-3 h-3" />
        {trend.label}
      </div>
    </Card>
  );
}

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-6 h-0.5 rounded-full"
        style={{
          background: dashed ? "transparent" : color,
          borderTop: dashed ? `2px dashed ${color}` : undefined,
        }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
