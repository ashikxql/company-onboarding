"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useState } from "react";
import { STEPS, STEP_IDS, stepHref, stepIndex, type StepId } from "@/lib/steps";
import { firstIncompleteBefore, useOnboarding } from "@/lib/store";
import { ArrowLeft, ArrowRight, ChevronRight, HelpCircle, Spinner, Star, Video } from "./Icons";
import { HowItWorksModal, NeedHelpModal } from "./Modal";
import { HelpPanel } from "./Sidebar";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`logo ${dark ? "logo-dark" : ""}`}>
      <Image src="/logo-mark.png" alt="" width={30} height={30} priority />
      <span>PowerMatch</span>
    </span>
  );
}

function Trustpilot() {
  return (
    <div className="trustpilot" aria-label="Rated 4.7 out of 5 on Trustpilot from 594 reviews">
      <span className="tp-brand">
        <Star size={16} /> Trustpilot
      </span>
      <span className="tp-row">
        <span>594 reviews · 4.7</span>
        <span className="tp-stars" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`tp-star ${i === 4 ? "tp-half" : ""}`}>
              <Star size={12} />
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

function Breadcrumbs({ current }: { current: StepId }) {
  const { state } = useOnboarding();
  return (
    <nav className="crumbs" aria-label="Onboarding steps">
      <ol>
        {STEPS.map((s, i) => {
          const reachable = firstIncompleteBefore(s.id, state) === null;
          const active = s.id === current;
          return (
            <Fragment key={s.id}>
              {i > 0 && (
                <li aria-hidden="true" className="crumb-sep">
                  <ChevronRight size={16} />
                </li>
              )}
              <li>
                {reachable && !active ? (
                  <Link href={stepHref(s.id)} className="crumb">
                    {s.crumb}
                  </Link>
                ) : (
                  <span className={`crumb ${active ? "is-active" : "is-locked"}`} aria-current={active ? "step" : undefined}>
                    {s.crumb}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export interface StepShellProps {
  step: StepId;
  canContinue: boolean;
  onContinue?: () => void | Promise<void>;
  continueLabel?: string;
  busy?: boolean;
  headerAction?: "how" | "help";
  /** Show chat / FAQ / about below the content on mobile (role step) */
  mobileSidebar?: boolean;
  bodyClassName?: string;
  children: React.ReactNode;
  after?: React.ReactNode;
}

export function StepShell({
  step,
  canContinue,
  onContinue,
  continueLabel = "Continue",
  busy = false,
  headerAction = "help",
  mobileSidebar = false,
  bodyClassName = "",
  children,
  after,
}: StepShellProps) {
  const router = useRouter();
  const params = useSearchParams();
  const editing = params.get("edit") === "1";
  const { state } = useOnboarding();
  const [howOpen, setHowOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const idx = stepIndex(step);
  const meta = STEPS[idx];
  const total = STEP_IDS.length;
  const prev = idx > 0 ? STEP_IDS[idx - 1] : null;

  const goNext = async () => {
    if (!canContinue || busy) return;
    if (onContinue) return onContinue();
    // While editing from the review page, jump straight back (or to whatever is still missing, e.g. a new email to confirm).
    const next = editing ? firstIncompleteBefore("review", state) ?? "review" : STEP_IDS[idx + 1];
    router.push(stepHref(next));
  };
  const goBack = () => {
    if (editing) router.push(stepHref("review"));
    else if (prev) router.push(stepHref(prev));
  };

  return (
    <div className="page">
      {/* Mobile top bar */}
      <header className="topbar mobile-only">
        <Logo />
        <span className="step-count">
          Step {idx + 1} of {total}
        </span>
        <div
          className="progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={idx + 1}
          aria-label="Progress"
        >
          <span style={{ width: `${((idx + 1) / total) * 100}%` }} />
        </div>
      </header>

      {/* Desktop hero */}
      <div className="hero desktop-only" aria-hidden="false">
        <div className="hero-inner">
          <div className="hero-top">
            <Logo dark />
            <Trustpilot />
          </div>
          <Breadcrumbs current={step} />
        </div>
      </div>

      <div className="layout">
        <main className="card" aria-labelledby="step-title">
          <div className="card-head">
            {prev && (
              <button className="icon-btn back-btn mobile-only" onClick={goBack} aria-label="Back">
                <ArrowLeft size={22} />
              </button>
            )}
            <h1 id="step-title" className="card-title">
              {meta.title}
            </h1>
            {headerAction === "how" ? (
              <button className="btn btn-soft btn-sm" onClick={() => setHowOpen(true)}>
                <Video size={18} /> How it works
              </button>
            ) : (
              <button className="btn btn-soft btn-sm mobile-only" onClick={() => setHelpOpen(true)}>
                Need help <HelpCircle size={18} />
              </button>
            )}
          </div>

          <div className={`card-body ${bodyClassName}`}>
            {children}
            {mobileSidebar && (
              <div className="mobile-only mobile-side">
                <HelpPanel />
              </div>
            )}
          </div>

          <div className="card-foot">
            {prev && (
              <button className="btn btn-ghost desktop-only" onClick={goBack}>
                <ArrowLeft size={20} /> Back
              </button>
            )}
            <button className="btn btn-primary btn-continue" onClick={goNext} disabled={!canContinue || busy}>
              {busy ? <Spinner size={20} /> : null}
              {continueLabel} {!busy && <ArrowRight size={20} />}
            </button>
          </div>
          {after}
        </main>

        <aside className="sidebar desktop-only" aria-label="Help">
          <HelpPanel />
        </aside>
      </div>

      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} />
      <NeedHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
}
