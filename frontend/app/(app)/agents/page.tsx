"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  Plus,
  MoreHorizontal,
  Phone,
  TrendingUp,
  Clock,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AGENTS = [
  {
    id: "a1",
    name: "CSAT Agent v2",
    description: "Post-project satisfaction survey. Collects structured feedback against a project brief.",
    totalCalls: 34,
    avgSentiment: "positive",
    completionRate: 91,
    lastUsed: "2h ago",
    firstSentence: "Hi, this is Alex from Sigma Studio — I'm calling for a quick feedback check on your recent project. Is now a good time?",
  },
  {
    id: "a2",
    name: "Sales Follow-up",
    description: "Follow-up with warm leads after initial outreach. Qualifies interest and books next step.",
    totalCalls: 18,
    avgSentiment: "positive",
    completionRate: 83,
    lastUsed: "5h ago",
    firstSentence: "Hi, this is Jamie — I'm following up on the note we sent you earlier this week. Do you have two minutes?",
  },
  {
    id: "a3",
    name: "Onboarding Check-in",
    description: "Week-1 check-in with new customers. Surfaces blockers and confirms activation.",
    totalCalls: 8,
    avgSentiment: "neutral",
    completionRate: 75,
    lastUsed: "3 days ago",
    firstSentence: "Hi there! I'm checking in on how your first week with us is going — just a quick 5-minute call. Is now okay?",
  },
];

function SentimentDot({ sentiment }: { sentiment: string }) {
  const map: Record<string, string> = {
    positive: "bg-emerald-400",
    neutral: "bg-slate-400",
    negative: "bg-red-400",
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${map[sentiment] ?? "bg-slate-400"}`} />;
}

export default function AgentLibraryPage() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Agent Library</h1>
          <p className="text-muted-foreground text-sm mt-1">{AGENTS.length} agents · Reusable across all calls</p>
        </div>
        <Link
          href="/agents/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Agent
        </Link>
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 gap-4">
        {AGENTS.map((agent) => (
          <Card key={agent.id} className="p-6 bg-card border-border hover:border-primary/20 transition-colors group">
            <div className="flex items-start justify-between gap-4">
              {/* Left */}
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{agent.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{agent.description}</p>
                  {/* First sentence preview */}
                  <div className="rounded-md bg-secondary border border-border px-3 py-2 text-xs text-muted-foreground italic max-w-xl">
                    &ldquo;{agent.firstSentence}&rdquo;
                  </div>
                </div>
              </div>

              {/* Right — stats + actions */}
              <div className="shrink-0 flex flex-col items-end gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-popover border-border">
                    <DropdownMenuItem className="text-sm cursor-pointer">
                      <Pencil className="w-3.5 h-3.5 mr-2" />Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm cursor-pointer">
                      <Copy className="w-3.5 h-3.5 mr-2" />Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-sm cursor-pointer text-red-400 focus:text-red-400">
                      <Trash2 className="w-3.5 h-3.5 mr-2" />Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-5">
                  <Stat icon={<Phone className="w-3.5 h-3.5" />} label="Calls" value={String(agent.totalCalls)} />
                  <Stat icon={<TrendingUp className="w-3.5 h-3.5" />} label="Completion" value={`${agent.completionRate}%`} />
                  <Stat
                    icon={<SentimentDot sentiment={agent.avgSentiment} />}
                    label="Avg sentiment"
                    value={agent.avgSentiment.charAt(0).toUpperCase() + agent.avgSentiment.slice(1)}
                  />
                  <Stat icon={<Clock className="w-3.5 h-3.5" />} label="Last used" value={agent.lastUsed} />
                </div>

                <Link
                  href={`/agents/new?from=${agent.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Use agent
                </Link>
              </div>
            </div>
          </Card>
        ))}

        {/* Empty state / CTA */}
        <Link href="/agents/new">
          <Card className="p-8 bg-card border-border border-dashed hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Plus className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Create a new agent</p>
                <p className="text-xs text-muted-foreground mt-1">Use the guided builder to define a prompt, first sentence, and guardrails — optimized for voice.</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
