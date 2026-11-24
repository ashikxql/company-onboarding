"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MAX_TASKS, MIN_SALARY, MIN_TASKS, ROLES, TRAVEL_MIN } from "./data";
import { STEP_IDS, type StepId } from "./steps";

export interface OnboardingState {
  role?: string;
  address?: string;
  addressFromGeo: boolean;
  travel: number;
  tasks: string[];
  license?: "yes" | "no";
  car?: "day-one" | "weeks" | "long-term" | "none";
  experience?: number;
  salary: string;
  salarySuggestion?: { amount: number; jobs: number };
  company: string;
  companyExisting: boolean;
  email: string;
  phone: string;
  emailConfirmed: boolean;
  /** One-off message shown on the next screen (e.g. "Email confirmed.") */
  flash?: string;
}

export const INITIAL_STATE: OnboardingState = {
  addressFromGeo: false,
  travel: 35,
  tasks: [],
  salary: "",
  company: "",
  companyExisting: false,
  email: "",
  phone: "",
  emailConfirmed: false,
};

const STORAGE_KEY = "pm-company-onboarding";

interface Ctx {
  state: OnboardingState;
  hydrated: boolean;
  update: (patch: Partial<OnboardingState>) => void;
  reset: () => void;
}

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...INITIAL_STATE, ...JSON.parse(raw) });
    } catch {
      /* storage unavailable — start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      // A changed email must be confirmed again.
      if (patch.email !== undefined && patch.email !== prev.email) next.emailConfirmed = false;
      return next;
    });
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  const value = useMemo(() => ({ state, hydrated, update, reset }), [state, hydrated, update, reset]);
  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): Ctx {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside <OnboardingProvider>");
  return ctx;
}

/* ---------- validation ---------- */

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => /^\d{8,10}$/.test(v.replace(/\s/g, ""));
export const salaryNumber = (v: string) => (v.trim() === "" ? NaN : Number(v));
export const isSalaryValid = (v: string) => {
  const n = salaryNumber(v);
  return Number.isFinite(n) && n >= MIN_SALARY;
};

export function isStepComplete(id: StepId, s: OnboardingState): boolean {
  switch (id) {
    case "role":
      return !!s.role;
    case "location":
      return !!s.address && s.travel >= TRAVEL_MIN;
    case "tasks":
      return s.tasks.length >= MIN_TASKS && s.tasks.length <= MAX_TASKS;
    case "requirements":
      return s.license === "no" || (s.license === "yes" && !!s.car);
    case "experience":
      return !!s.experience && isSalaryValid(s.salary);
    case "contact":
      return s.company.trim() !== "" && isEmail(s.email) && isPhone(s.phone);
    case "confirm":
      return s.emailConfirmed;
    case "review":
      return true;
  }
}

/** First step before `id` that is not complete, or null if all previous steps are done. */
export function firstIncompleteBefore(id: StepId, s: OnboardingState): StepId | null {
  for (const step of STEP_IDS) {
    if (step === id) return null;
    if (!isStepComplete(step, s)) return step;
  }
  return null;
}

export const roleName = (id?: string) => ROLES.find((r) => r.id === id)?.name ?? "";
