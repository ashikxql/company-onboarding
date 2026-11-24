export const STEP_IDS = [
  "role",
  "location",
  "tasks",
  "requirements",
  "experience",
  "contact",
  "confirm",
  "review",
] as const;

export type StepId = (typeof STEP_IDS)[number];

export interface StepMeta {
  id: StepId;
  /** Title in the card header */
  title: string;
  /** Short label in the desktop breadcrumb */
  crumb: string;
}

export const STEPS: StepMeta[] = [
  { id: "role", title: "Choose a role", crumb: "Role" },
  { id: "location", title: "Work location", crumb: "Location" },
  { id: "tasks", title: "Select tasks", crumb: "Tasks" },
  { id: "requirements", title: "Requirements", crumb: "Requirements" },
  { id: "experience", title: "Experience & pay", crumb: "Experience" },
  { id: "contact", title: "Contact Info", crumb: "Contact info" },
  { id: "confirm", title: "Contact Info", crumb: "Confirm email" },
  { id: "review", title: "Review & submit", crumb: "Review" },
];

export function isStepId(value: string): value is StepId {
  return (STEP_IDS as readonly string[]).includes(value);
}

export function stepIndex(id: StepId): number {
  return STEP_IDS.indexOf(id);
}

export function stepHref(id: StepId, edit = false): string {
  return `/onboarding/${id}${edit ? "?edit=1" : ""}`;
}
