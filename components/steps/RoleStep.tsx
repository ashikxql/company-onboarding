"use client";

import Image from "next/image";
import { useState } from "react";
import { ROLES } from "@/lib/data";
import { isStepComplete, useOnboarding } from "@/lib/store";
import { CheckCircle } from "../Icons";
import { HelpModal } from "../Modal";
import { StepShell } from "../Shell";
import { FieldHead } from "../ui";

export function RoleStep() {
  const { state, update } = useOnboarding();
  const [help, setHelp] = useState<string | null>(null);

  return (
    <StepShell
      step="role"
      canContinue={isStepComplete("role", state)}
      headerAction="how"
      mobileSidebar
      bodyClassName="body-scroll"
    >
      <FieldHead
        id="role-label"
        title="Select a role"
        desc="Choose the role you're hiring for. You can change this later."
        onHelp={() => setHelp("role")}
      />
      <div className="role-grid" role="radiogroup" aria-labelledby="role-label">
        {ROLES.map((r) => {
          const selected = state.role === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`role-tile ${selected ? "is-selected" : ""}`}
              onClick={() => update({ role: r.id })}
              data-tip="Start with one job. Add more later."
            >
              {selected && <CheckCircle className="role-check" size={22} />}
              <Image src={r.image} alt="" width={95} height={88} className="role-img" />
              <span className="role-name">{r.name}</span>
            </button>
          );
        })}
      </div>
      <HelpModal topic={help} onClose={() => setHelp(null)} />
    </StepShell>
  );
}
