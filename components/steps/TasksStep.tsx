"use client";

import { useState } from "react";
import { MAX_TASKS, TASKS } from "@/lib/data";
import { isStepComplete, useOnboarding } from "@/lib/store";
import { HelpModal } from "../Modal";
import { StepShell } from "../Shell";
import { CheckCard, FieldHead } from "../ui";

export function TasksStep() {
  const { state, update } = useOnboarding();
  const [help, setHelp] = useState<string | null>(null);

  const toggle = (task: string) => {
    const has = state.tasks.includes(task);
    update({ tasks: has ? state.tasks.filter((t) => t !== task) : [...state.tasks, task] });
  };
  const full = state.tasks.length >= MAX_TASKS;

  return (
    <StepShell step="tasks" canContinue={isStepComplete("tasks", state)}>
      <FieldHead title="Select the tasks" desc="Pick 2–3 tasks the worker will handle." onHelp={() => setHelp("tasks")} />
      <div className="options" role="group" aria-label="Tasks">
        {TASKS.map((t) => {
          const checked = state.tasks.includes(t);
          return (
            <CheckCard key={t} label={t} checked={checked} disabled={!checked && full} onChange={() => toggle(t)} />
          );
        })}
      </div>
      {full && <p className="msg msg-muted">You can pick up to {MAX_TASKS} tasks.</p>}
      <HelpModal topic={help} onClose={() => setHelp(null)} />
    </StepShell>
  );
}
