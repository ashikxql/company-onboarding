"use client";

import { useEffect, useId, useRef, useState } from "react";
import { suggestSalary } from "@/lib/api";
import { EXPERIENCE_YEARS, MIN_SALARY, SALARY_STEPS } from "@/lib/data";
import { isStepComplete, roleName, salaryNumber, useOnboarding } from "@/lib/store";
import { AlertCircle, Calculator, Check, CheckCircle, ChevronDown, ChevronUp, Spinner } from "../Icons";
import { HelpModal } from "../Modal";
import { StepShell } from "../Shell";
import { FieldHead } from "../ui";

const yearsLabel = (n: number) => `${String(n).padStart(2, "0")} years`;

function YearsSelect({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(Math.max(0, (value ?? 1) - 1));
  const wrap = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (open) list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const choose = (v: number) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div className="combo" ref={wrap}>
      <button
        type="button"
        className={`input select-trigger ${open ? "is-focus" : ""} ${value ? "" : "is-placeholder"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`Minimum years of experience${value ? `: ${yearsLabel(value)}` : ""}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!open) setOpen(true);
            else setActive((i) => Math.min(i + 1, EXPERIENCE_YEARS.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((i) => Math.max(i - 1, 0));
          } else if ((e.key === "Enter" || e.key === " ") && open) {
            e.preventDefault();
            choose(EXPERIENCE_YEARS[active]);
          } else if (e.key === "Escape") setOpen(false);
        }}
      >
        <span>{value ? yearsLabel(value) : "Select experience"}</span>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {open && (
        <ul className="dropdown" id={listId} role="listbox" ref={list}>
          {EXPERIENCE_YEARS.map((y, i) => (
            <li
              key={y}
              data-index={i}
              role="option"
              aria-selected={y === value}
              className={`dropdown-item ${i === active ? "is-active" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(y)}
            >
              <span>{yearsLabel(y)}</span>
              {y === value && <Check size={20} className="item-check" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ExperienceStep() {
  const { state, update } = useOnboarding();
  const [help, setHelp] = useState<string | null>(null);
  const [touched, setTouched] = useState(state.salary !== "");
  const [calcStep, setCalcStep] = useState(-1); // -1 idle, 0..n running
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const calculating = calcStep >= 0;
  const n = salaryNumber(state.salary);
  const tooLow = touched && state.salary !== "" && Number.isFinite(n) && n < MIN_SALARY;
  const postcode = state.address?.match(/\d{4}\s+[^,]+/)?.[0] ?? "your area";

  const calculate = () => {
    timers.current.forEach(clearTimeout);
    setCalcStep(0);
    SALARY_STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setCalcStep(i + 1), 550 * (i + 1)));
    });
    timers.current.push(
      setTimeout(() => {
        const s = suggestSalary(state.role, state.experience);
        update({ salary: String(s.amount), salarySuggestion: s });
        setTouched(true);
        setCalcStep(-1);
      }, 550 * (SALARY_STEPS.length + 1))
    );
  };

  const showSuggestion = !calculating && state.salarySuggestion && String(state.salarySuggestion.amount) === state.salary;

  return (
    <StepShell step="experience" canContinue={isStepComplete("experience", state) && !calculating}>
      <FieldHead
        title="Minimum years of experience"
        desc="The least experience a worker needs for this role."
        onHelp={() => setHelp("experience")}
      />
      <YearsSelect value={state.experience} onChange={(experience) => update({ experience })} />

      <div className="section">
        <FieldHead
          title="Hourly salary rate"
          desc="Set an hourly rate to attract best-fit workers. The range is not binding."
          onHelp={() => setHelp("salary")}
        />
        <div className="salary-row">
          <div className={`addon-input ${tooLow ? "is-error" : ""}`}>
            <input
              className="input"
              inputMode="numeric"
              placeholder="Enter amount"
              aria-label="Hourly salary in DKK"
              aria-invalid={tooLow}
              aria-describedby="salary-msg"
              value={state.salary}
              onChange={(e) => update({ salary: e.target.value.replace(/[^\d]/g, "").slice(0, 5) })}
              onBlur={() => setTouched(true)}
            />
            {tooLow && <AlertCircle size={18} className="input-error-icon" />}
            <span className="addon">DKK</span>
          </div>
          <button type="button" className="btn btn-soft btn-block btn-calc" onClick={calculate} disabled={calculating}>
            {calculating ? <Spinner size={20} /> : <Calculator size={20} />}
            {calculating ? "Calculating" : state.salarySuggestion ? "Recalculate" : "Calculate salary"}
          </button>
        </div>

        <div id="salary-msg" aria-live="polite">
          {tooLow ? (
            <p className="msg msg-error">
              <AlertCircle size={20} /> Salary is too low
            </p>
          ) : showSuggestion ? (
            <p className="msg msg-success">
              <CheckCircle size={20} /> Suggested from {state.salarySuggestion!.jobs} similar{" "}
              {roleName(state.role) || "matching"} jobs near {postcode}.
            </p>
          ) : (
            !state.salarySuggestion && (
              <p className="msg msg-muted">
                Not sure? Press “Calculate salary” and we&apos;ll suggest a range based on similar jobs.
              </p>
            )
          )}
        </div>

        {calculating && (
          <ul className="calc-list">
            {SALARY_STEPS.map((label, i) => (
              <li key={label} className={i < calcStep ? "is-done" : ""}>
                {i < calcStep ? <CheckCircle size={20} /> : <Spinner size={20} />}
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <HelpModal topic={help} onClose={() => setHelp(null)} />
    </StepShell>
  );
}
