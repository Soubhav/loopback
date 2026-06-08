"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Bell,
  CreditCard,
  Key,
  ChevronRight,
  CheckCircle2,
  ExternalLink,
  Zap,
} from "lucide-react";

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

function SettingsSection({ children }: { children: React.ReactNode }) {
  return <Card className="p-6 bg-card border-border space-y-5">{children}</Card>;
}

export default function SettingsPage() {
  const [tokenVisible, setTokenVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [byokVisible, setByokVisible] = useState<Record<string, boolean>>({});
  const [emailNotif, setEmailNotif] = useState(true);

  const token = "lbk_live_sk_e2f1a3b4c5d6e7f8a9b0c1d2e3f4a5b6";
  const maskedToken = "lbk_live_sk_••••••••••••••••••••••••••••••";

  function copyToken() {
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function toggleByok(key: string) {
    setByokVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="p-8 max-w-[720px] mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account, keys, and preferences</p>
      </div>

      {/* API Token */}
      <section>
        <SectionHeader
          title="API Token"
          description="Use this token in npx loopback-mcp install to wire Loopback into Claude Code."
        />
        <SettingsSection>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  readOnly
                  value={tokenVisible ? token : maskedToken}
                  className="bg-secondary border-border font-mono text-xs h-10 pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    onClick={() => setTokenVisible(!tokenVisible)}
                    className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {tokenVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={copyToken}
                    className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-border bg-secondary text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>
            <div className="bg-secondary rounded-md border border-border p-3">
              <p className="text-xs text-muted-foreground font-mono">
                <span className="text-muted-foreground/60">$</span>{" "}
                <span className="text-primary">npx</span> loopback-mcp install --token {tokenVisible ? token : "lbk_live_sk_••••"}
              </p>
            </div>
          </div>
        </SettingsSection>
      </section>

      {/* Plan & Usage */}
      <section id="plan">
        <SectionHeader
          title="Plan & Usage"
          description="Your current plan and call usage this billing period."
        />
        <SettingsSection>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-foreground">Starter</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  Current plan
                </span>
              </div>
              <p className="text-xs text-muted-foreground">25 calls/month · 30-day recording retention · Email notifications</p>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              <Zap className="w-3.5 h-3.5" />
              Upgrade
            </button>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Calls used this month</span>
              <span className="font-medium text-foreground">24 / 25</span>
            </div>
            <Progress value={96} className="h-1.5" />
            <p className="text-xs text-amber-400">1 call remaining — upgrade before you run out.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Starter", calls: "25 calls/mo", price: "$29/mo", current: true },
              { label: "Growth", calls: "150 calls/mo", price: "$99/mo", current: false },
              { label: "Enterprise", calls: "Unlimited", price: "Custom", current: false },
            ].map((plan) => (
              <div
                key={plan.label}
                className={`rounded-lg border p-4 space-y-1 ${
                  plan.current ? "border-primary/40 bg-primary/5" : "border-border bg-secondary hover:border-border/80 cursor-pointer transition-colors"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{plan.label}</p>
                  {plan.current && <span className="text-xs text-primary">Active</span>}
                </div>
                <p className="text-xs text-muted-foreground">{plan.calls}</p>
                <p className="text-sm font-semibold text-foreground">{plan.price}</p>
              </div>
            ))}
          </div>
        </SettingsSection>
      </section>

      {/* Notifications */}
      <section>
        <SectionHeader
          title="Notifications"
          description="Choose how you want to be notified when calls complete."
        />
        <SettingsSection>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email notifications</p>
              <p className="text-xs text-muted-foreground mt-0.5">Get an email with call summary + link to dashboard when a call completes.</p>
            </div>
            <button
              onClick={() => setEmailNotif(!emailNotif)}
              className={`relative w-10 h-6 rounded-full transition-colors ${emailNotif ? "bg-primary" : "bg-secondary border border-border"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${emailNotif ? "left-5" : "left-1"}`} />
            </button>
          </div>

          <Separator className="bg-border" />

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Notification email</Label>
            <Input
              defaultValue="john@company.com"
              className="bg-secondary border-border h-10 text-sm focus:border-primary/50"
            />
          </div>
        </SettingsSection>
      </section>

      {/* BYOK */}
      <section>
        <SectionHeader
          title="API Key Overrides (BYOK)"
          description="Override Loopback's default infrastructure with your own API keys. Leave blank to use defaults."
        />
        <SettingsSection>
          <div className="space-y-4">
            {[
              { key: "twilio", label: "Twilio", hint: "Account SID + Auth Token for telephony", placeholder: "AC••••••••••••••••••••••••••••••" },
              { key: "deepgram", label: "Deepgram", hint: "Speech-to-text (STT)", placeholder: "dg_••••••••••••••••••••••" },
              { key: "cartesia", label: "Cartesia", hint: "Text-to-speech (TTS)", placeholder: "sk_••••••••••••••••••••••" },
              { key: "anthropic", label: "Anthropic", hint: "LLM — defaults to claude-sonnet-4-6", placeholder: "sk-ant-••••••••••••••••••••••" },
            ].map(({ key, label, hint, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-medium text-foreground">{label}</Label>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                </div>
                <div className="relative">
                  <Input
                    type={byokVisible[key] ? "text" : "password"}
                    placeholder={placeholder}
                    className="bg-secondary border-border h-10 font-mono text-xs pr-10 focus:border-primary/50"
                  />
                  <button
                    onClick={() => toggleByok(key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {byokVisible[key] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Save keys
          </button>
        </SettingsSection>
      </section>

      {/* Security */}
      <section>
        <SectionHeader
          title="Security"
          description="Manage two-factor authentication and active sessions."
        />
        <SettingsSection>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Two-factor authentication</p>
                <p className="text-xs text-emerald-400">Enabled · Authenticator app</p>
              </div>
            </div>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Manage
            </button>
          </div>

          <Separator className="bg-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Active sessions</p>
              <p className="text-xs text-muted-foreground">1 device · MacBook Pro · Last active now</p>
            </div>
            <button className="text-xs text-red-400 hover:text-red-300 transition-colors">
              Sign out all
            </button>
          </div>
        </SettingsSection>
      </section>
    </div>
  );
}
