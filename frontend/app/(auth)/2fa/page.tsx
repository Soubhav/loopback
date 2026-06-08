"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function TwoFactorPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, val: string) {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      inputs.current[5]?.focus();
    }
  }

  const filled = code.every((d) => d !== "");

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Two-factor authentication</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the 6-digit code from your authenticator app.
          </p>
        </div>
      </div>

      <Card className="p-6 bg-card border-border space-y-6">
        <div className="flex items-center justify-center gap-3" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-11 h-14 text-center text-xl font-semibold rounded-lg border bg-secondary transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                digit ? "border-primary/50 text-foreground" : "border-border text-muted-foreground"
              }`}
            />
          ))}
        </div>

        <Link
          href="/dashboard"
          className={`flex items-center justify-center w-full h-10 rounded-md text-sm font-medium transition-colors ${
            filled
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary/20 text-primary-foreground/40 pointer-events-none"
          }`}
        >
          Verify and continue
        </Link>

        <p className="text-xs text-muted-foreground text-center">
          Didn&apos;t receive a code?{" "}
          <button className="text-primary hover:text-primary/80 transition-colors">Resend</button>
        </p>
      </Card>

      <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to login
      </Link>
    </div>
  );
}
