import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StepScreen } from "@/components/steps/StepScreen";
import { STEP_IDS, STEPS, isStepId } from "@/lib/steps";

export function generateStaticParams() {
  return STEP_IDS.map((step) => ({ step }));
}

export async function generateMetadata({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  const meta = STEPS.find((s) => s.id === step);
  return { title: meta ? `${meta.crumb} · PowerMatch` : "PowerMatch" };
}

export default async function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (!isStepId(step)) notFound();
  return (
    <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
      <StepScreen step={step} />
    </Suspense>
  );
}
