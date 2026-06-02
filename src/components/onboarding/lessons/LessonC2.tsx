import { docStructureLessonC2 } from "@/content/onboarding/moduleC";
import { BulletSection } from "@/components/onboarding/BulletSection";
import { LessonIntro } from "@/components/onboarding/LessonIntro";
import { LessonShell } from "@/components/onboarding/LessonShell";
import { SynthesisBox } from "@/components/onboarding/SynthesisBox";

/**
 * C2 · Estructura documental — "Estructura documental en Teams"
 *
 * Estructura:
 *  1. Premisa.
 *  2. Callout regla base nivel cliente.
 *  3. Tabla de árbol de carpetas (4 niveles).
 *  4. Cards apiladas para las 3 subcarpetas obligatorias de XX_Instagram.
 *  5. Errores que no se cometen (BulletSection callout).
 *  6. Traducción operativa (BulletSection).
 *  7. Síntesis.
 */
export function LessonC2({
  elapsedSeconds,
  reachedEnd,
  minLessonSeconds,
}: {
  elapsedSeconds: number;
  reachedEnd: boolean;
  minLessonSeconds: number;
}) {
  const d = docStructureLessonC2;
  return (
    <LessonShell
      label={d.label}
      title={d.title}
      elapsedSeconds={elapsedSeconds}
      reachedEnd={reachedEnd}
      minLessonSeconds={minLessonSeconds}
      maxWidth="max-w-[760px]"
    >
      <LessonIntro paragraphs={d.premise} keyPrefix="c2-premise" />

      {/* Callout regla nivel cliente */}
      <div className="mt-8 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">{d.clientLevelRule.label}</p>
        <p className="mt-1 text-[17px] font-semibold leading-snug text-slate-900">{d.clientLevelRule.statement}</p>
        {d.clientLevelRule.body && (
          <div className="mt-3 space-y-2 text-[16px] leading-relaxed text-slate-700">
            {d.clientLevelRule.body.map((line, i) => (
              <p key={`c2-rule-${i}`}>{line}</p>
            ))}
          </div>
        )}
      </div>

      {/* Árbol de carpetas */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.folderTree.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.folderTree.intro}</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="hidden border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:grid sm:grid-cols-[1fr_1.5fr_1.2fr] sm:gap-2">
            <p>Nivel</p>
            <p>Descripción</p>
            <p>Ejemplo</p>
          </div>
          <div className="divide-y divide-slate-200">
            {d.folderTree.levels.map((lvl) => (
              <div key={lvl.level} className="grid gap-1 px-3 py-3 sm:grid-cols-[1fr_1.5fr_1.2fr] sm:gap-2">
                <p className="text-[15px] font-semibold text-slate-900">{lvl.level}</p>
                <p className="text-[15px] leading-relaxed text-slate-700">{lvl.description}</p>
                <p className="font-mono text-[13px] leading-relaxed text-violet-800">{lvl.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estructura XX_Instagram */}
      <section className="mt-8">
        <h3 className="text-xl font-semibold text-slate-900">{d.instagramStructure.heading}</h3>
        <p className="mt-2 text-[16px] leading-relaxed text-slate-700">{d.instagramStructure.intro}</p>
        <div className="mt-4 space-y-4">
          {d.instagramStructure.folders.map((folder) => (
            <div key={folder.name} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="font-mono text-[15px] font-semibold text-violet-800">{folder.name}/</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-slate-700">
                {folder.contains.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Errores que no se cometen */}
      <BulletSection
        className="mt-8"
        tone="callout"
        heading={d.neverMix.heading}
        bullets={d.neverMix.bullets}
      />

      {/* Traducción operativa */}
      <BulletSection
        className="mt-8"
        heading={d.translation.heading}
        bullets={d.translation.bullets}
      />

      <SynthesisBox lines={d.synthesis} keyPrefix="c2-synth" />
    </LessonShell>
  );
}
