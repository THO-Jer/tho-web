"use client";

import type { Dispatch, SetStateAction } from "react";

import { integrationLessonA8 } from "@/content/onboarding/moduleA";
import { LessonShell } from "@/components/onboarding/LessonShell";

export type IntegrationAnswerValue = "si" | "no" | null;
export type IntegrationAnswers = Record<string, IntegrationAnswerValue>;

/**
 * A8 · Integración — "Qué significa operar bajo el estándar THO"
 *
 * Es la única lección de A con interactividad real (no solo lectura):
 *  - Resumen del módulo.
 *  - Autoevaluación con 4 preguntas Sí/No (state controlado por el padre).
 *  - Declaración operativa.
 *  - Checkbox de confirmación + botón que hace scroll al quiz.
 *
 * Recibe state y handlers desde page.tsx para mantener el contrato actual
 * (las respuestas y la confirmación son formativas, no se persisten).
 */
export function LessonA8({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
  integrationAnswers,
  setIntegrationAnswers,
  integrationConfirmed,
  setIntegrationConfirmed,
  onContinueToQuiz,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
  integrationAnswers: IntegrationAnswers;
  setIntegrationAnswers: Dispatch<SetStateAction<IntegrationAnswers>>;
  integrationConfirmed: boolean;
  setIntegrationConfirmed: Dispatch<SetStateAction<boolean>>;
  onContinueToQuiz: () => void;
}) {
  return (
    <LessonShell
      label={integrationLessonA8.label}
      title={integrationLessonA8.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
      padding="p-6 sm:p-10"
    >
      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-[15px] leading-relaxed text-slate-700">Durante este módulo revisaste:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
          {integrationLessonA8.summary.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-3 text-[15px] font-medium text-slate-800">Ahora la pregunta no es conceptual. Es operativa.</p>
      </section>

      <section className="mt-8 space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Autoevaluación breve</h3>
        {integrationLessonA8.selfAssessment.map((item, idx) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-semibold text-slate-900">{idx + 1}. {item.prompt}</p>
            <p className="mt-1 text-[15px] leading-relaxed text-slate-700">{item.question}</p>
            <div className="mt-3 flex gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={`integration-${item.id}`}
                  checked={integrationAnswers[item.id] === "si"}
                  onChange={() => setIntegrationAnswers((prev) => ({ ...prev, [item.id]: "si" }))}
                />
                Sí
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name={`integration-${item.id}`}
                  checked={integrationAnswers[item.id] === "no"}
                  onChange={() => setIntegrationAnswers((prev) => ({ ...prev, [item.id]: "no" }))}
                />
                No
              </label>
            </div>
          </div>
        ))}
        <p className="text-[15px] font-medium text-slate-800">{integrationLessonA8.assessmentClosing}</p>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">{integrationLessonA8.declaration.heading}</h3>
        <p className="mt-2 text-[15px] text-slate-700">{integrationLessonA8.declaration.intro}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-slate-700">
          {integrationLessonA8.declaration.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 text-[15px] font-medium text-slate-800">
          {integrationLessonA8.declaration.closing.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-300 bg-white p-5">
        <h3 className="text-lg font-semibold text-slate-900">Confirmación antes del quiz</h3>
        <label className="mt-3 inline-flex items-start gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={integrationConfirmed}
            onChange={(e) => setIntegrationConfirmed(e.target.checked)}
            className="mt-0.5"
          />
          <span>{integrationLessonA8.confirmationLabel}</span>
        </label>
        <div className="mt-4">
          <button
            type="button"
            disabled={!integrationConfirmed}
            onClick={onContinueToQuiz}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {integrationLessonA8.actionLabel}
          </button>
        </div>
      </section>
    </LessonShell>
  );
}
