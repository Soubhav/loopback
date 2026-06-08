"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Mic,
  Sparkles,
  CheckCircle2,
  Bot,
  FileText,
  MessageSquare,
  Eye,
  Pencil,
  X,
  Plus,
} from "lucide-react";
import Link from "next/link";

type Step = "upload" | "braindump" | "processing" | "review" | "name";

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "upload", label: "Reference doc", icon: <FileText className="w-3.5 h-3.5" /> },
  { id: "braindump", label: "Describe intent", icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: "processing", label: "AI processing", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: "review", label: "Review template", icon: <Eye className="w-3.5 h-3.5" /> },
  { id: "name", label: "Name & save", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
];

const STEP_ORDER: Step[] = ["upload", "braindump", "processing", "review", "name"];

// Mock generated template
const GENERATED_TEMPLATE = {
  firstSentence: "Hi, this is Alex from Sigma Studio — I'm calling for a quick feedback check on your recent project. Is now a good time?",
  prompt: "You are a professional customer satisfaction agent for Sigma Studio. Your goal is to collect honest, structured feedback from the customer about their recently completed project. Speak naturally and conversationally. Ask one question at a time. Listen actively and follow up if something is unclear. Keep the call focused on the agenda — do not discuss pricing, new projects, or sales.",
  botDescription: "CSAT feedback agent. Scope: feedback on completed project only. Do not discuss: pricing, future projects, personnel issues. End call when all agenda items are covered or customer indicates they need to leave.",
  guardrails: [
    "Stay within the project feedback scope",
    "Do not discuss pricing or future engagements",
    "If asked about complaints, acknowledge and redirect to summary",
    "End the call within 10 minutes",
  ],
  dispositions: ["Resolved", "Follow-up required", "Escalate", "Reschedule"],
  warnings: [
    "First sentence is concise ✓",
    "Prompt is voice-optimized ✓",
  ],
};

export default function AgentBuilderPage() {
  const [step, setStep] = useState<Step>("upload");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [braindump, setBraindump] = useState("");
  const [agentName, setAgentName] = useState("");
  const [template, setTemplate] = useState(GENERATED_TEMPLATE);
  const [editingField, setEditingField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stepIndex = STEP_ORDER.indexOf(step);
  const progressPercent = ((stepIndex) / (STEP_ORDER.length - 1)) * 100;

  function goNext() {
    const next = STEP_ORDER[stepIndex + 1];
    if (next) {
      if (next === "processing") {
        setStep("processing");
        setTimeout(() => setStep("review"), 2500);
      } else {
        setStep(next);
      }
    }
  }

  function goBack() {
    const prev = STEP_ORDER[stepIndex - 1];
    if (prev) setStep(prev);
  }

  return (
    <div className="p-8 max-w-[780px] mx-auto space-y-8">
      {/* Back */}
      <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to agents
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Build an agent</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Give your agent context and intent — the AI will build a voice-optimized template.
        </p>
      </div>

      {/* Step progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const isActive = s.id === step;
            const isDone = STEP_ORDER.indexOf(s.id) < stepIndex;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  isActive ? "text-primary" : isDone ? "text-emerald-400" : "text-muted-foreground"
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isActive ? "border-primary bg-primary/10" : isDone ? "border-emerald-400 bg-emerald-400/10" : "border-border"
                  }`}>
                    {isDone ? <CheckCircle2 className="w-3 h-3" /> : s.icon}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px w-8 mx-2 transition-colors ${isDone ? "bg-emerald-400/40" : "bg-border"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === "upload" && (
          <StepUpload
            uploadedFile={uploadedFile}
            onFile={setUploadedFile}
            fileInputRef={fileInputRef}
            onNext={goNext}
          />
        )}
        {step === "braindump" && (
          <StepBraindump
            value={braindump}
            onChange={setBraindump}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === "processing" && <StepProcessing />}
        {step === "review" && (
          <StepReview
            template={template}
            onUpdate={setTemplate}
            editingField={editingField}
            onEditField={setEditingField}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {step === "name" && (
          <StepName
            name={agentName}
            onChange={setAgentName}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}

/* ── Step 1: Upload ── */
function StepUpload({ uploadedFile, onFile, fileInputRef, onNext }: {
  uploadedFile: string | null;
  onFile: (name: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Upload a reference document</h2>
        <p className="text-sm text-muted-foreground">
          This gives your agent factual context — a project brief, research doc, or any background material.
          <span className="text-primary ml-1">Optional but recommended.</span>
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.md,.txt"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f.name);
        }}
      />

      {uploadedFile ? (
        <Card className="p-5 bg-card border-border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{uploadedFile}</p>
              <p className="text-xs text-muted-foreground">Ready to use</p>
            </div>
            <button
              onClick={() => onFile("")}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all p-12 flex flex-col items-center gap-3 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Drop a file or click to browse</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, Markdown, or plain text · Max 10MB</p>
          </div>
        </button>
      )}

      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onNext}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip — I don&apos;t have a document
        </button>
        <button
          onClick={onNext}
          disabled={!uploadedFile}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* ── Step 2: Brain dump ── */
function StepBraindump({ value, onChange, onNext, onBack }: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Describe your agent&apos;s intent</h2>
        <p className="text-sm text-muted-foreground">
          Tell the AI who this agent is, what it should do, and any rules it must follow. Don&apos;t worry about structure — just talk or type freely.
        </p>
      </div>

      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. This is a customer satisfaction agent for Sigma Studio. It should call clients after project delivery and collect honest feedback. It should ask about overall satisfaction, quality of work, communication, and whether they'd recommend us. It should never discuss pricing or future projects. Keep it under 10 minutes. Tone should be warm and professional."
          className="min-h-[220px] bg-secondary border-border text-sm leading-relaxed resize-none pr-12 focus:border-primary/50 placeholder:text-muted-foreground/50"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-1">
          <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" title="Voice input (works with Wispr Flow)">
            <Mic className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-secondary rounded-lg border border-border p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground mb-2">Tips for a great brain dump:</p>
        <p>· Who is the agent? (persona, name, company)</p>
        <p>· What is the goal of each call?</p>
        <p>· What topics are off-limits?</p>
        <p>· What tone should it use?</p>
        <p>· What should happen at the end of the call?</p>
        <p className="mt-2 text-primary/80">Using Wispr Flow? Just click the mic and talk naturally.</p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />Back
        </button>
        <button
          onClick={onNext}
          disabled={value.trim().length < 20}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <Sparkles className="w-4 h-4" />
          Generate template
        </button>
      </div>
    </div>
  );
}

/* ── Step 3: Processing ── */
function StepProcessing() {
  const steps = [
    "Analyzing reference document…",
    "Extracting agenda and key facts…",
    "Optimizing prompt for voice…",
    "Generating first sentence…",
    "Building guardrails…",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-primary animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <h2 className="text-lg font-medium">Building your agent template…</h2>
        <p className="text-sm text-muted-foreground">Claude is processing your inputs and optimizing for voice.</p>
      </div>
      <div className="w-full max-w-sm space-y-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3 text-xs text-muted-foreground animate-in fade-in" style={{ animationDelay: `${i * 400}ms` }}>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Step 4: Review ── */
function StepReview({ template, onUpdate, editingField, onEditField, onNext, onBack }: {
  template: typeof GENERATED_TEMPLATE;
  onUpdate: (t: typeof GENERATED_TEMPLATE) => void;
  editingField: string | null;
  onEditField: (f: string | null) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-medium mb-1">Review your agent template</h2>
        <p className="text-sm text-muted-foreground">
          Claude has optimized everything for voice. Review and edit anything before saving.
        </p>
      </div>

      {/* Warnings/validations */}
      {template.warnings.length > 0 && (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 space-y-1">
          {template.warnings.map((w, i) => (
            <p key={i} className="text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5" />{w}
            </p>
          ))}
        </div>
      )}

      {/* First sentence */}
      <ReviewField
        label="First sentence"
        hint="What the agent says when the call connects"
        value={template.firstSentence}
        isEditing={editingField === "firstSentence"}
        onEdit={() => onEditField("firstSentence")}
        onCancel={() => onEditField(null)}
        onSave={(v) => { onUpdate({ ...template, firstSentence: v }); onEditField(null); }}
        multiline={false}
      />

      {/* Prompt */}
      <ReviewField
        label="Voice prompt"
        hint="Core behavior — optimized for spoken conversation"
        value={template.prompt}
        isEditing={editingField === "prompt"}
        onEdit={() => onEditField("prompt")}
        onCancel={() => onEditField(null)}
        onSave={(v) => { onUpdate({ ...template, prompt: v }); onEditField(null); }}
        multiline
      />

      {/* Bot description */}
      <ReviewField
        label="Bot description & guardrails summary"
        hint="Agent identity and scope boundaries"
        value={template.botDescription}
        isEditing={editingField === "botDescription"}
        onEdit={() => onEditField("botDescription")}
        onCancel={() => onEditField(null)}
        onSave={(v) => { onUpdate({ ...template, botDescription: v }); onEditField(null); }}
        multiline
      />

      {/* Guardrails */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Guardrails</p>
            <p className="text-xs text-muted-foreground">Rules the agent must follow</p>
          </div>
        </div>
        <Card className="p-4 bg-card border-border space-y-2">
          {template.guardrails.map((g, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="text-muted-foreground mt-0.5">·</span>
              <span>{g}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Dispositions */}
      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-foreground">Dispositions</p>
          <p className="text-xs text-muted-foreground">Valid call outcomes the agent can assign</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {template.dispositions.map((d, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary border border-border text-xs font-medium text-foreground">
              {d}
              <button
                onClick={() => onUpdate({ ...template, dispositions: template.dispositions.filter((_, j) => j !== i) })}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
            <Plus className="w-3 h-3" />Add
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />Back
        </button>
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Looks good
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ReviewField({ label, hint, value, isEditing, onEdit, onCancel, onSave, multiline }: {
  label: string;
  hint: string;
  value: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (v: string) => void;
  multiline: boolean;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        {!isEditing && (
          <button onClick={onEdit} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Pencil className="w-3 h-3" />Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          {multiline ? (
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="bg-secondary border-border text-sm min-h-[100px] focus:border-primary/50"
            />
          ) : (
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="bg-secondary border-border text-sm focus:border-primary/50"
            />
          )}
          <div className="flex gap-2">
            <button onClick={() => { onSave(draft); }} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">Save</button>
            <button onClick={onCancel} className="px-3 py-1.5 rounded-md bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
          </div>
        </div>
      ) : (
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-foreground leading-relaxed">{value}</p>
        </Card>
      )}
    </div>
  );
}

/* ── Step 5: Name & Save ── */
function StepName({ name, onChange, onBack }: {
  name: string;
  onChange: (v: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-1">Name your agent</h2>
        <p className="text-sm text-muted-foreground">
          Give it a clear name you&apos;ll recognize when selecting it for a call.
        </p>
      </div>

      <div className="space-y-2">
        <Input
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. CSAT Agent v2, Sales Follow-up, Onboarding Check-in"
          className="bg-secondary border-border text-base h-12 focus:border-primary/50"
          autoFocus
        />
      </div>

      {/* Preview card */}
      {name && (
        <Card className="p-5 bg-card border-border border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-xs text-muted-foreground">Ready to use · 0 calls</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between pt-2">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />Back
        </button>
        <Link
          href="/agents"
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-colors ${
            name.trim().length > 0
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary/30 text-primary-foreground/50 pointer-events-none"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Save agent
        </Link>
      </div>
    </div>
  );
}
