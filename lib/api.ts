/**
 * Mock backend. Replace these with real API calls.
 */
import { ROLES } from "./data";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Demo verification code accepted by `verifyEmailCode`. */
export const DEMO_CODE = "2536";

export async function sendEmailCode(_email: string): Promise<void> {
  await wait(400);
}

export async function verifyEmailCode(_email: string, code: string): Promise<boolean> {
  await wait(600);
  return code === DEMO_CODE;
}

export function suggestSalary(roleId: string | undefined, years: number | undefined) {
  const base = ROLES.find((r) => r.id === roleId)?.baseRate ?? 220;
  const amount = Math.round((base + Math.min(years ?? 0, 15) * 4) / 5) * 5;
  const jobs = 80 + ((base * 7 + (years ?? 0) * 13) % 90);
  return { amount, jobs };
}

export async function submitJob(_payload: unknown): Promise<void> {
  await wait(900);
}
