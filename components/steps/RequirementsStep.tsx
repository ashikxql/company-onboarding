"use client";

import { useState } from "react";
import { REQUIREMENT_CAR, REQUIREMENT_LICENSE } from "@/lib/data";
import { isStepComplete, useOnboarding } from "@/lib/store";
import { HelpModal } from "../Modal";
import { StepShell } from "../Shell";
import { FieldHead, RadioCard } from "../ui";

export function RequirementsStep() {
  const { state, update } = useOnboarding();
  const [help, setHelp] = useState<string | null>(null);

  return (
    <StepShell step="requirements" canContinue={isStepComplete("requirements", state)}>
      <FieldHead
        id="license-label"
        title="Driving license required"
        desc="Does the worker need a valid driver's license?"
        onHelp={() => setHelp("license")}
      />
      <div className="options" role="radiogroup" aria-labelledby="license-label">
        {REQUIREMENT_LICENSE.map((o) => (
          <RadioCard
            key={o.id}
            name="license"
            label={o.label}
            checked={state.license === o.id}
            onChange={() => update({ license: o.id, car: o.id === "no" ? undefined : state.car })}
          />
        ))}
      </div>

      {state.license === "yes" && (
        <div className="section">
          <FieldHead
            id="car-label"
            title="Company car"
            desc="When a company car is available for this role."
            onHelp={() => setHelp("car")}
          />
          <div className="options" role="radiogroup" aria-labelledby="car-label">
            {REQUIREMENT_CAR.map((o) => (
              <RadioCard
                key={o.id}
                name="car"
                label={o.label}
                checked={state.car === o.id}
                onChange={() => update({ car: o.id })}
              />
            ))}
          </div>
        </div>
      )}
      <HelpModal topic={help} onClose={() => setHelp(null)} />
    </StepShell>
  );
}
