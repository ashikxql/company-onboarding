"use client";

import Link from "next/link";
import { Logo } from "@/components/Shell";
import { CheckCircle } from "@/components/Icons";
import { roleName, useOnboarding } from "@/lib/store";

export default function DonePage() {
  const { state, reset } = useOnboarding();
  return (
    <div className="page done-page">
      <header className="topbar mobile-only">
        <Logo />
      </header>
      <div className="hero desktop-only">
        <div className="hero-inner">
          <div className="hero-top">
            <Logo dark />
          </div>
        </div>
      </div>
      <main className="card done-card">
        <span className="done-icon">
          <CheckCircle size={36} />
        </span>
        <h1>Your matches are on the way</h1>
        <p>
          We&apos;re matching {roleName(state.role) ? <strong>{roleName(state.role)}s</strong> : "workers"} near your
          job right now. We&apos;ll send your non-binding matches to <strong>{state.email || "your inbox"}</strong> —
          usually within minutes.
        </p>
        <Link href="/onboarding/role" className="btn btn-primary" onClick={reset}>
          Post another job
        </Link>
      </main>
    </div>
  );
}
