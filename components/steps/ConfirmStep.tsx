"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DEMO_CODE, sendEmailCode, verifyEmailCode } from "@/lib/api";
import { useOnboarding } from "@/lib/store";
import { stepHref } from "@/lib/steps";
import { Mail } from "../Icons";
import { StepShell } from "../Shell";

const LENGTH = 4;
const RESEND_SECONDS = 42;

export function ConfirmStep() {
  const { state, update } = useOnboarding();
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const code = digits.join("");
  const complete = code.length === LENGTH;

  const setAt = (i: number, v: string) => {
    setError(false);
    setDigits((d) => d.map((x, j) => (j === i ? v : x)));
  };

  const fill = (text: string, from: number) => {
    const chars = text.replace(/\D/g, "").slice(0, LENGTH - from).split("");
    if (!chars.length) return;
    setError(false);
    setDigits((d) => d.map((x, j) => (j >= from && j < from + chars.length ? chars[j - from] : x)));
    refs.current[Math.min(from + chars.length, LENGTH - 1)]?.focus();
  };

  const verify = async () => {
    setBusy(true);
    const ok = await verifyEmailCode(state.email, code);
    setBusy(false);
    if (!ok) {
      setError(true);
      return;
    }
    update({ emailConfirmed: true, flash: "Email confirmed." });
    router.push(stepHref("review"));
  };

  const resend = async () => {
    setDigits(Array(LENGTH).fill(""));
    setError(false);
    setSeconds(RESEND_SECONDS);
    refs.current[0]?.focus();
    await sendEmailCode(state.email);
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <StepShell step="confirm" canContinue={complete && !error} onContinue={verify} busy={busy}>
      <div className="otp-wrap">
        <div className="otp-hero" aria-hidden="true">
          <span className="otp-icon">
            <Mail size={28} />
          </span>
        </div>
        <h2 className="otp-title">Enter the 4-digit code</h2>
        <p className="otp-text">
          <strong>{state.email || "your email"}</strong>{" "}
          {state.companyExisting
            ? "is already linked to a PowerMatch profile. Confirm your inbox to add this job to your existing profile. You’ll see your matches next."
            : "to create your PowerMatch profile. Confirm your inbox to continue and see your matches next."}
        </p>

        <form
          className="otp"
          onSubmit={(e) => {
            e.preventDefault();
            if (complete && !busy) verify();
          }}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={`otp-box ${error ? "is-error" : ""}`}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              value={d}
              aria-label={`Digit ${i + 1} of ${LENGTH}`}
              aria-invalid={error}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                // Whole code at once (SMS/email autofill, fast typing): spread it over the boxes.
                if (raw.length > (d ? 2 : 1)) return fill(raw, i);
                // Typing over an existing digit: keep the new one.
                const v = d && raw.length === 2 ? (raw[0] === d ? raw[1] : raw[0]) : raw;
                setAt(i, v);
                if (v && i < LENGTH - 1) refs.current[i + 1]?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !d && i > 0) {
                  setAt(i - 1, "");
                  refs.current[i - 1]?.focus();
                } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
                else if (e.key === "ArrowRight" && i < LENGTH - 1) refs.current[i + 1]?.focus();
              }}
              onPaste={(e) => {
                e.preventDefault();
                fill(e.clipboardData.getData("text"), i);
              }}
            />
          ))}
          <button type="submit" hidden />
        </form>

        <div aria-live="polite">
          {error && <p className="otp-error">Incorrect code.</p>}
        </div>
        {seconds > 0 && (
          <p className="otp-timer">
            Available in {mm}:{ss}
          </p>
        )}
        <p className="otp-resend">
          Didn&apos;t get it?{" "}
          <button type="button" className="link" onClick={resend} disabled={seconds > 0}>
            Resend code
          </button>
        </p>
        <p className="otp-demo">Demo code: {DEMO_CODE}</p>
      </div>
    </StepShell>
  );
}
