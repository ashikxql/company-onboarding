"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { submitJob } from "@/lib/api";
import { REQUIREMENT_CAR } from "@/lib/data";
import { roleName, useOnboarding } from "@/lib/store";
import { stepHref, type StepId } from "@/lib/steps";
import { Info } from "../Icons";
import { StepShell } from "../Shell";
import { Toast } from "../ui";

function ReviewCard({ title, step, children }: { title: string; step: StepId; children: React.ReactNode }) {
  return (
    <div className="review-card">
      <div className="review-head">
        <h3>{title}</h3>
        <Link href={stepHref(step, true)} className="link" aria-label={`Edit ${title.toLowerCase()}`}>
          Edit
        </Link>
      </div>
      <p>{children}</p>
    </div>
  );
}

export function ReviewStep() {
  const { state, update } = useOnboarding();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const closeToast = useCallback(() => update({ flash: undefined }), [update]);

  const car = REQUIREMENT_CAR.find((c) => c.id === state.car);
  const requirements =
    state.license === "yes"
      ? `Driving license required · Car: ${car ? (car.id === "none" ? "No company car" : car.label) : "—"}`
      : "No driving license required";

  const submit = async () => {
    setBusy(true);
    await submitJob(state);
    router.push("/onboarding/done");
  };

  return (
    <StepShell
      step="review"
      canContinue
      onContinue={submit}
      busy={busy}
      continueLabel="Get Matches"
      after={state.flash ? <Toast message={state.flash} onClose={closeToast} /> : null}
    >
      <div className="review-grid">
        <ReviewCard title="Role" step="role">
          {roleName(state.role)}
        </ReviewCard>
        <ReviewCard title="Location" step="location">
          {state.address?.replace(/, Denmark$/, "")} · within {state.travel} minutes
        </ReviewCard>
        <ReviewCard title="Tasks" step="tasks">
          {state.tasks.join(", ")}
        </ReviewCard>
        <ReviewCard title="Requirements" step="requirements">
          {requirements}
        </ReviewCard>
        <ReviewCard title="Experience" step="experience">
          {state.experience} {state.experience === 1 ? "year" : "years"}
        </ReviewCard>
        <ReviewCard title="Salary" step="experience">
          DKK {state.salary} / hour · not binding
        </ReviewCard>
        <ReviewCard title="Contact" step="contact">
          {state.company} · {state.email} · +45 {state.phone}
        </ReviewCard>
      </div>

      <div className="notice">
        <span className="notice-icon">
          <Info size={20} />
        </span>
        <div>
          <strong>You&apos;ll receive non-binding matches</strong>
          <p>Reviewing matches is completely free — you don&apos;t pay anything to see who&apos;s available.</p>
        </div>
      </div>
    </StepShell>
  );
}
