"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { firstIncompleteBefore, useOnboarding } from "@/lib/store";
import { stepHref, type StepId } from "@/lib/steps";
import { ConfirmStep } from "./ConfirmStep";
import { ContactStep } from "./ContactStep";
import { ExperienceStep } from "./ExperienceStep";
import { LocationStep } from "./LocationStep";
import { RequirementsStep } from "./RequirementsStep";
import { ReviewStep } from "./ReviewStep";
import { RoleStep } from "./RoleStep";
import { TasksStep } from "./TasksStep";

const SCREENS: Record<StepId, () => React.ReactElement> = {
  role: RoleStep,
  location: LocationStep,
  tasks: TasksStep,
  requirements: RequirementsStep,
  experience: ExperienceStep,
  contact: ContactStep,
  confirm: ConfirmStep,
  review: ReviewStep,
};

/** Renders a step, redirecting to the first unfinished step if the user skipped ahead. */
export function StepScreen({ step }: { step: StepId }) {
  const { state, hydrated } = useOnboarding();
  const router = useRouter();
  const missing = hydrated ? firstIncompleteBefore(step, state) : null;

  useEffect(() => {
    if (missing) router.replace(stepHref(missing));
  }, [missing, router]);

  if (!hydrated || missing) return <div className="page-loading" aria-busy="true" />;
  const Screen = SCREENS[step];
  return <Screen />;
}
