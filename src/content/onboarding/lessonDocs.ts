/**
 * Registro único de lecciones data-driven del onboarding.
 *
 * Cada adaptador convierte el contenido editorial de moduleA-D.ts (que sigue
 * siendo la única fuente de verdad del texto) a un `LessonDoc` de bloques.
 * El render vive en src/components/onboarding/LessonRenderer.tsx.
 *
 * Para editar contenido: tocar solo moduleX.ts.
 * Para agregar una lección nueva: crear su dato editorial + un adaptador acá.
 * (LessonA8 es interactiva y mantiene componente propio.)
 */

import type { LessonBlock, LessonDoc } from "@/content/onboarding/blocks";
import {
  architecturalLessonA1,
  boundaryLessonA6,
  contrastLessonA2,
  culturalLessonA5,
  ethicsLessonA7,
  foundationalLessonA0,
  operationalLessonA3,
  qualityLessonA4,
} from "@/content/onboarding/moduleA";
import {
  commercialClosingLessonB7,
  commercialEthicsLessonB6,
  consultiveSalesLessonB1,
  crmLessonB5,
  dualEngineLessonB2,
  pricingLessonB3,
  qualificationLessonB4,
  type QualificationTier,
} from "@/content/onboarding/moduleB";
import {
  annualExcelLessonC3,
  closingLearningLessonC7,
  continuityCLessonC9,
  docStructureLessonC2,
  dodCreativeLessonC6,
  kickoffLessonC4,
  productionReviewLessonC5,
  scrumAdaptationLessonC1,
  sensitiveInfoLessonC8,
} from "@/content/onboarding/moduleC";
import {
  advancedFormationLessonD9,
  advisingMeaningLessonD1,
  alertSignsLessonD10,
  closingModuleDLesson,
  conceptualBasesLessonD2,
  diagnosisLessonD4,
  dodAdvisoryLessonD6,
  ethicsAdvisoryLessonD8,
  interventionStructureLessonD3,
  strategicDesignLessonD5,
  traceabilityLessonD7,
} from "@/content/onboarding/moduleD";

const tierTone = (tier: QualificationTier) =>
  tier === "IDEAL" ? ("success" as const) : tier === "VIABLE" ? ("warning" as const) : ("danger" as const);

// ---------------------------------------------------------------------------
// Módulo A · Identidad THO
// ---------------------------------------------------------------------------

function buildA0(): LessonDoc {
  const d = foundationalLessonA0;
  return {
    label: d.label,
    title: d.title,
    blocks: [
      { kind: "paragraphs", text: d.strategicFrame },
      ...d.blocks.map<LessonBlock>((b) => ({
        kind: "bullets",
        heading: b.heading,
        intro: [b.intro],
        bullets: b.bullets,
        closing: b.closing,
      })),
      { kind: "bullets", heading: d.tension.heading, intro: [d.tension.intro], bullets: d.tension.bullets, closing: d.tension.closing },
      { kind: "bullets", heading: d.practice.heading, intro: [d.practice.intro], bullets: d.practice.bullets },
      { kind: "reflection", heading: "Micro-reflexión", text: d.reflection },
    ],
  };
}

function buildA1(): LessonDoc {
  const d = architecturalLessonA1;
  return {
    label: d.label,
    title: d.title,
    blocks: [
      { kind: "paragraphs", text: d.definition },
      ...d.sections.map<LessonBlock>((s) => ({
        kind: "bullets",
        heading: s.heading,
        intro: [s.intro],
        bullets: s.bullets,
        closing: s.closing,
      })),
      { kind: "scenario", heading: d.scenario.heading, lines: d.scenario.text },
      { kind: "bullets", heading: d.translation.heading, intro: [d.translation.intro], bullets: d.translation.bullets },
      { kind: "synthesis", lines: [d.synthesis] },
    ],
  };
}

function buildA2(): LessonDoc {
  const d = contrastLessonA2;
  return {
    label: d.label,
    title: d.title,
    blocks: [
      { kind: "paragraphs", text: d.hook },
      {
        kind: "columns",
        items: [
          { title: d.purpose.heading, body: [d.purpose.question, d.purpose.answer], bullets: d.purpose.bullets, closing: d.purpose.closing },
          { title: d.value.heading, body: [d.value.question, d.value.answer], bullets: d.value.bullets, closing: d.value.closing },
        ],
      },
      { kind: "bullets", heading: d.crossing.heading, intro: [d.crossing.intro, d.crossing.body], bullets: d.crossing.bullets, closing: d.crossing.closing },
      { kind: "scenario", heading: d.scenario.heading, lines: d.scenario.lines },
      { kind: "bullets", heading: d.translation.heading, intro: [d.translation.intro], bullets: d.translation.bullets, closing: d.translation.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildA3(): LessonDoc {
  const d = operationalLessonA3;
  return {
    label: d.label,
    title: d.title,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      ...d.sections.map<LessonBlock>((s) => ({
        kind: "bullets",
        heading: s.heading,
        intro: [s.intro],
        bullets: s.bullets,
        closing: s.closing,
      })),
      { kind: "chips", heading: d.cycle.heading, items: d.cycle.stages, closing: d.cycle.closing, boxed: true },
      { kind: "bullets", heading: d.principles.heading, bullets: d.principles.bullets },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildA4(): LessonDoc {
  const d = qualityLessonA4;
  return {
    label: d.label,
    title: d.title,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.whatIs.heading, intro: [d.whatIs.intro], bullets: d.whatIs.bullets, closing: d.whatIs.closing },
      { kind: "bullets", tone: "callout", heading: d.whatIsNot.heading, intro: [d.whatIsNot.intro], bullets: d.whatIsNot.bullets, closing: d.whatIsNot.closing },
      { kind: "cards", heading: d.criteria.heading, flat: true, items: d.criteria.items.map((item) => ({ title: item.title, body: [item.description] })) },
      { kind: "scenario", heading: d.scenario.heading, lines: d.scenario.lines },
      { kind: "checklist", heading: d.checklist.heading, intro: d.checklist.intro, items: d.checklist.bullets, closing: d.checklist.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildA5(): LessonDoc {
  const d = culturalLessonA5;
  return {
    label: d.label,
    title: d.title,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      ...d.sections.flatMap<LessonBlock>((s) => [
        { kind: "heading", text: s.heading },
        { kind: "labeledList", label: "Qué protege", bullets: s.protects },
        { kind: "labeledList", label: "Qué exige", bullets: s.requires },
        { kind: "paragraphs", text: [s.standard], emphasis: true },
        { kind: "labeledList", label: "Qué invalida", bullets: s.invalidates },
      ]),
      { kind: "bullets", tone: "callout", heading: d.tension.heading, intro: [d.tension.intro], bullets: d.tension.bullets, closing: d.tension.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildA6(): LessonDoc {
  const d = boundaryLessonA6;
  return {
    label: d.label,
    title: d.title,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "cards",
        heading: "Cláusulas no negociables",
        flat: true,
        items: d.clauses.map((clause) => ({
          title: clause.title,
          labelStyle: true,
          statement: clause.statement,
          body: [clause.body],
          closing: clause.closing,
        })),
      },
      { kind: "scenario", heading: d.tension.heading, lines: d.tension.lines },
      { kind: "steps", heading: d.protocol.heading, intro: [d.protocol.intro], items: d.protocol.steps.map((step) => ({ detail: step })), boxed: true },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildA7(): LessonDoc {
  const d = ethicsLessonA7;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.risk.heading, intro: [d.risk.intro], bullets: d.risk.bullets, closing: d.risk.closing },
      { kind: "bullets", heading: d.alerts.heading, intro: [d.alerts.intro], bullets: d.alerts.bullets, closing: d.alerts.closing },
      { kind: "steps", heading: d.protocol.heading, intro: [d.protocol.intro], variant: "cards", boxed: true, items: d.protocol.steps.map((step) => ({ tag: step.tag, detail: step.detail })) },
      { kind: "bullets", heading: d.escalation.heading, intro: [d.escalation.intro, d.escalation.triggersIntro], bullets: d.escalation.bullets, closing: d.escalation.closing },
      { kind: "table", heading: d.matrix.heading, headerInBox: true, gridCols: "sm:grid-cols-[1.5fr_1fr]", rows: d.matrix.rows.map((row) => [row.condition, row.action]), colStyles: ["strong", "arrow"] },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

// ---------------------------------------------------------------------------
// Módulo B · Ventas en THO
// ---------------------------------------------------------------------------

function buildB1(): LessonDoc {
  const d = consultiveSalesLessonB1;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: [d.tension], emphasis: true },
      { kind: "paragraphs", text: d.intro },
      { kind: "bullets", heading: d.conceptual.heading, intro: [d.conceptual.intro], bullets: d.conceptual.bullets },
      {
        kind: "columns",
        heading: d.difference.heading,
        items: [
          { title: "Venta transaccional", tone: "neutral", bullets: d.difference.transactional },
          { title: "Venta institucional THO", bullets: d.difference.institutional },
        ],
      },
      { kind: "bullets", heading: d.rector.heading, intro: [d.rector.statement, d.rector.closing, "Aceptar un cliente incompatible puede generar:"], bullets: d.rector.bullets },
      { kind: "bullets", tone: "card", heading: d.mindset.heading, bullets: d.mindset.questions, ordered: true, closing: d.mindset.closing },
    ],
  };
}

function buildB2(): LessonDoc {
  const d = dualEngineLessonB2;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "panel",
        heading: d.keyAccounts.heading,
        tagline: d.keyAccounts.tagline,
        blocks: [
          { kind: "paragraphs", text: [d.keyAccounts.intro] },
          { kind: "bullets", bullets: d.keyAccounts.bullets },
          { kind: "paragraphs", text: [d.keyAccounts.closing], emphasis: true },
        ],
      },
      {
        kind: "panel",
        heading: d.tickets.heading,
        tagline: d.tickets.tagline,
        blocks: [
          { kind: "paragraphs", text: [d.tickets.intro] },
          { kind: "bullets", bullets: d.tickets.bullets },
          { kind: "paragraphs", text: [d.tickets.functionStatement] },
          { kind: "labeledList", label: d.tickets.priorityHeading, bullets: d.tickets.priorityTickets },
          { kind: "labeledList", label: d.tickets.notTicketsIntro, bullets: d.tickets.notTickets, boxed: true },
        ],
      },
      { kind: "heading", text: d.funnel.heading, intro: [...d.funnel.body, d.funnel.targetLine, d.funnel.pitchTiming] },
      {
        kind: "panel",
        heading: d.digital.heading,
        variant: "dashed",
        blocks: [
          { kind: "paragraphs", text: [d.digital.intro] },
          { kind: "paragraphs", text: [d.digital.statement], emphasis: true },
          { kind: "paragraphs", text: [d.digital.context] },
          { kind: "paragraphs", text: [d.digital.rule], emphasis: true },
          { kind: "paragraphs", text: [d.digital.operationalIntro] },
          { kind: "bullets", bullets: d.digital.operationalBullets },
          { kind: "paragraphs", text: [d.digital.caution], emphasis: true },
        ],
      },
      { kind: "bullets", heading: d.translation.heading, intro: [d.translation.intro], bullets: d.translation.bullets },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildB3(): LessonDoc {
  const d = pricingLessonB3;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.whyUF.heading, intro: [d.whyUF.intro], bullets: d.whyUF.bullets },
      { kind: "rule", tone: "neutral", label: d.whyUF.rule.label, statement: d.whyUF.rule.statement, body: d.whyUF.rule.body },
      { kind: "bullets", heading: d.whatDefinesPrice.heading, bullets: d.whatDefinesPrice.bullets, closing: d.whatDefinesPrice.closing },
      { kind: "heading", text: d.bands.heading },
      {
        kind: "panel",
        heading: d.bands.tickets.heading,
        tagline: d.bands.tickets.tagline,
        blocks: [
          { kind: "bullets", bullets: d.bands.tickets.bullets },
          { kind: "labeledList", label: d.bands.tickets.priorityHeading, bullets: d.bands.tickets.priorityTickets },
          { kind: "paragraphs", text: [d.bands.tickets.rule], emphasis: true },
        ],
      },
      {
        kind: "panel",
        heading: d.bands.keyAccounts.heading,
        tagline: d.bands.keyAccounts.tagline,
        blocks: [
          {
            kind: "table",
            columns: [d.bands.keyAccounts.tableHeaders.banda, d.bands.keyAccounts.tableHeaders.range, d.bands.keyAccounts.tableHeaders.entrega],
            gridCols: "sm:grid-cols-[0.8fr_1fr_2fr]",
            rows: d.bands.keyAccounts.rows.map((row) => [row.banda, row.range, row.entrega]),
          },
          { kind: "paragraphs", text: [d.bands.keyAccounts.note], emphasis: true },
        ],
      },
      {
        kind: "panel",
        heading: d.bands.digital.heading,
        tagline: d.bands.digital.tagline,
        variant: "dashed",
        blocks: [
          { kind: "bullets", bullets: d.bands.digital.bullets },
          { kind: "paragraphs", text: [d.bands.digital.modules] },
          { kind: "paragraphs", text: [d.bands.digital.note], emphasis: true },
        ],
      },
      { kind: "bullets", heading: d.presentation.heading, bullets: d.presentation.bullets },
      { kind: "heading", text: d.negotiation.heading },
      { kind: "quote", label: d.negotiation.objectionLabel, text: d.negotiation.objection },
      { kind: "bullets", bullets: d.negotiation.rules },
      { kind: "paragraphs", text: [d.negotiation.operatingRule], emphasis: true },
      { kind: "paragraphs", text: [d.negotiation.ticketRule] },
      { kind: "rule", tone: "neutral", label: d.negotiation.packExample.heading, body: [d.negotiation.packExample.body] },
      { kind: "bullets", tone: "callout", heading: d.nonNegotiables.heading, bullets: d.nonNegotiables.bullets },
      { kind: "bullets", heading: d.translation.heading, intro: [d.translation.intro], bullets: d.translation.bullets },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildB4(): LessonDoc {
  const d = qualificationLessonB4;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.whyQualify.heading, intro: [d.whyQualify.intro, d.whyQualify.listIntro], bullets: d.whyQualify.listBullets },
      {
        kind: "cards",
        heading: d.culturalFilter.heading,
        intro: [d.culturalFilter.intro],
        flat: true,
        items: d.culturalFilter.questions.map((q) => ({ title: q.name, body: [q.question] })),
      },
      { kind: "rule", tone: "warning", body: [d.culturalFilter.warningOne, d.culturalFilter.warningMany] },
      { kind: "heading", text: d.motorProfiles.heading, intro: [d.motorProfiles.intro] },
      {
        kind: "panel",
        heading: d.motorProfiles.keyAccounts.heading,
        tagline: d.motorProfiles.keyAccounts.tagline,
        blocks: [
          { kind: "cards", flat: true, items: d.motorProfiles.keyAccounts.tiers.map((tier) => ({ badge: { text: tier.name, tone: tierTone(tier.name) }, body: [tier.profile] })) },
        ],
      },
      {
        kind: "panel",
        heading: d.motorProfiles.tickets.heading,
        tagline: d.motorProfiles.tickets.tagline,
        blocks: [
          { kind: "cards", flat: true, items: d.motorProfiles.tickets.tiers.map((tier) => ({ badge: { text: tier.name, tone: tierTone(tier.name) }, body: [tier.profile] })) },
        ],
      },
      {
        kind: "columns",
        heading: d.redFlags.heading,
        intro: [d.redFlags.intro],
        cols: 3,
        items: d.redFlags.phases.map((phase) => ({ title: phase.heading, tone: "neutral" as const, bullets: phase.bullets })),
        closing: d.redFlags.closing,
      },
      { kind: "bullets", heading: d.exit.heading, intro: [d.exit.intro], bullets: d.exit.indicators },
      { kind: "paragraphs", text: [d.exit.framing] },
      { kind: "quote", text: d.exit.quote },
      { kind: "paragraphs", text: [d.exit.closing], emphasis: true },
      { kind: "bullets", heading: d.translation.heading, bullets: d.translation.bullets },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildB5(): LessonDoc {
  const d = crmLessonB5;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "heading", text: d.whatIsIt.heading, intro: d.whatIsIt.body },
      { kind: "bullets", heading: d.whyExists.heading, intro: [d.whyExists.intro], bullets: d.whyExists.bullets },
      { kind: "rule", tone: "neutral", label: d.whyExists.rule.label, statement: d.whyExists.rule.statement, body: [d.whyExists.rule.body] },
      { kind: "heading", text: d.twoSides.heading, intro: [d.twoSides.intro] },
      {
        kind: "panel",
        heading: d.twoSides.commercial.heading,
        tagline: d.twoSides.commercial.tagline,
        blocks: [{ kind: "labeledList", label: "Pestañas", bullets: d.twoSides.commercial.tabs }],
      },
      {
        kind: "panel",
        heading: d.twoSides.accounting.heading,
        tagline: d.twoSides.accounting.tagline,
        blocks: [
          { kind: "cards", label: "Pestañas", flat: true, items: d.twoSides.accounting.tabs.map((tab) => ({ title: tab.name, body: [tab.description] })) },
        ],
      },
      { kind: "paragraphs", text: [d.twoSides.closing], emphasis: true },
      { kind: "heading", text: d.pipelineStates.heading, intro: [d.pipelineStates.intro] },
      { kind: "chips", items: d.pipelineStates.activeStates },
      { kind: "paragraphs", text: [d.pipelineStates.leadOrigin], muted: true },
      { kind: "rule", tone: "neutral", label: d.pipelineStates.closureLabel, body: [d.pipelineStates.closure] },
      { kind: "bullets", tone: "callout", heading: d.rules.heading, bullets: d.rules.bullets },
      { kind: "bullets", heading: d.translation.heading, bullets: d.translation.bullets },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildB6(): LessonDoc {
  const d = commercialEthicsLessonB6;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "cards",
        heading: d.fundamentals.heading,
        intro: [d.fundamentals.intro],
        flat: true,
        items: d.fundamentals.items.map((item) => ({ statement: item.statement, body: [item.explanation] })),
        closing: d.fundamentals.closing,
      },
      { kind: "bullets", heading: d.whyEthicsProtects.heading, intro: [d.whyEthicsProtects.intro], bullets: d.whyEthicsProtects.bullets },
      {
        kind: "cards",
        heading: d.objections.heading,
        intro: [d.objections.intro],
        flat: true,
        items: d.objections.items.map((item) => ({
          quote: item.objection,
          fields: [
            { label: d.objections.trapLabel, text: item.trap, tone: "danger" as const },
            { label: d.objections.ethicalLabel, text: item.ethical, tone: "success" as const },
          ],
        })),
      },
      { kind: "bullets", tone: "callout", heading: d.neverDo.heading, intro: [d.neverDo.intro], bullets: d.neverDo.bullets },
      { kind: "bullets", heading: d.whenToDecline.heading, intro: [d.whenToDecline.intro], bullets: d.whenToDecline.bullets, closing: d.whenToDecline.closing },
      { kind: "bullets", heading: d.translation.heading, bullets: d.translation.bullets },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildB7(): LessonDoc {
  const d = commercialClosingLessonB7;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "cards",
        heading: d.threeDocuments.heading,
        intro: [d.threeDocuments.intro],
        flat: true,
        items: d.threeDocuments.documents.map((doc) => ({ title: doc.name, tagline: doc.tagline, body: doc.body })),
      },
      { kind: "bullets", heading: d.contractContents.heading, intro: [d.contractContents.intro], bullets: d.contractContents.bullets, closing: d.contractContents.closing },
      { kind: "heading", text: d.byMotor.heading },
      { kind: "panel", heading: d.byMotor.keyAccounts.heading, tagline: d.byMotor.keyAccounts.tagline, blocks: [{ kind: "bullets", bullets: d.byMotor.keyAccounts.bullets }] },
      { kind: "panel", heading: d.byMotor.tickets.heading, tagline: d.byMotor.tickets.tagline, blocks: [{ kind: "bullets", bullets: d.byMotor.tickets.bullets }] },
      { kind: "panel", heading: d.byMotor.digital.heading, tagline: d.byMotor.digital.tagline, variant: "dashed", blocks: [{ kind: "bullets", bullets: d.byMotor.digital.bullets }] },
      { kind: "heading", text: d.kickoff.heading, intro: [d.kickoff.intro] },
      { kind: "labeledList", label: d.kickoff.coversHeading, bullets: d.kickoff.covers },
      { kind: "labeledList", label: d.kickoff.prepHeading, bullets: d.kickoff.prep },
      { kind: "paragraphs", text: [d.kickoff.closing], emphasis: true },
      { kind: "heading", text: d.renewal.heading, intro: [d.renewal.intro] },
      {
        kind: "panel",
        heading: d.renewal.annual.heading,
        blocks: [{ kind: "steps", variant: "badge", items: d.renewal.annual.timeline.map((step) => ({ tag: step.month, detail: step.action })) }],
      },
      { kind: "rule", tone: "neutral", label: d.renewal.short.heading, body: [d.renewal.short.body] },
      { kind: "paragraphs", text: [d.renewal.ticketsLine] },
      { kind: "paragraphs", text: [d.renewal.digitalLine] },
      {
        kind: "panel",
        heading: d.renewal.upsell.heading,
        blocks: [
          {
            kind: "columns",
            items: [
              { title: d.renewal.upsell.yesIntro, tone: "success" as const, bullets: d.renewal.upsell.yes },
              { title: d.renewal.upsell.noIntro, tone: "danger" as const, bullets: d.renewal.upsell.no },
            ],
          },
          { kind: "paragraphs", text: [d.renewal.upsell.how] },
        ],
      },
      { kind: "bullets", tone: "callout", heading: d.commonErrors.heading, intro: [d.commonErrors.intro], bullets: d.commonErrors.bullets },
      { kind: "bullets", heading: d.translation.heading, bullets: d.translation.bullets },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

// ---------------------------------------------------------------------------
// Módulo C · Operación Creativa
// ---------------------------------------------------------------------------

function buildC1(): LessonDoc {
  const d = scrumAdaptationLessonC1;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.scrumPrinciples.heading, intro: d.scrumPrinciples.intro ? [d.scrumPrinciples.intro] : undefined, bullets: d.scrumPrinciples.bullets, closing: d.scrumPrinciples.closing },
      {
        kind: "table",
        heading: d.rolesTable.heading,
        intro: [d.rolesTable.intro],
        columns: ["Rol Scrum", "Función original", "En THO hoy"],
        rows: d.rolesTable.rows.map((row) => [row.role, row.function, row.thoEquivalent]),
        colStyles: ["strong", "default", "accent"],
      },
      { kind: "bullets", heading: d.thoAdaptation.heading, intro: d.thoAdaptation.intro ? [d.thoAdaptation.intro] : undefined, bullets: d.thoAdaptation.bullets, closing: d.thoAdaptation.closing },
      { kind: "rule", label: d.kanbanRule.label, statement: d.kanbanRule.statement, body: d.kanbanRule.body },
      { kind: "bullets", heading: d.translation.heading, intro: d.translation.intro ? [d.translation.intro] : undefined, bullets: d.translation.bullets, closing: d.translation.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildC2(): LessonDoc {
  const d = docStructureLessonC2;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "rule", label: d.clientLevelRule.label, statement: d.clientLevelRule.statement, body: d.clientLevelRule.body },
      {
        kind: "table",
        heading: d.folderTree.heading,
        intro: [d.folderTree.intro],
        columns: ["Nivel", "Descripción", "Ejemplo"],
        gridCols: "sm:grid-cols-[1fr_1.5fr_1.2fr]",
        rows: d.folderTree.levels.map((lvl) => [lvl.level, lvl.description, lvl.example]),
        colStyles: ["strong", "default", "mono"],
      },
      {
        kind: "cards",
        heading: d.instagramStructure.heading,
        intro: [d.instagramStructure.intro],
        flat: true,
        items: d.instagramStructure.folders.map((folder) => ({ title: folder.name, bullets: folder.contains })),
      },
      { kind: "bullets", tone: "callout", heading: d.neverMix.heading, intro: d.neverMix.intro ? [d.neverMix.intro] : undefined, bullets: d.neverMix.bullets, closing: d.neverMix.closing },
      { kind: "bullets", heading: d.translation.heading, intro: d.translation.intro ? [d.translation.intro] : undefined, bullets: d.translation.bullets, closing: d.translation.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildC3(): LessonDoc {
  const d = annualExcelLessonC3;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "table",
        heading: d.mandatoryFields.heading,
        intro: [d.mandatoryFields.intro],
        columns: ["Campo", "Por qué es obligatorio"],
        gridCols: "sm:grid-cols-[1fr_2fr]",
        rows: d.mandatoryFields.fields.map((f) => [f.field, f.why]),
      },
      { kind: "rule", label: d.correspondenceRule.label, statement: d.correspondenceRule.statement, body: d.correspondenceRule.body },
      { kind: "bullets", heading: d.howToUse.heading, intro: d.howToUse.intro ? [d.howToUse.intro] : undefined, bullets: d.howToUse.bullets, closing: d.howToUse.closing, ordered: true },
      { kind: "bullets", tone: "callout", heading: d.neverDo.heading, intro: d.neverDo.intro ? [d.neverDo.intro] : undefined, bullets: d.neverDo.bullets, closing: d.neverDo.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildC4(): LessonDoc {
  const d = kickoffLessonC4;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "rule", label: d.briefRule.label, statement: d.briefRule.statement, body: d.briefRule.body },
      {
        kind: "table",
        heading: d.kickoffChecklist.heading,
        intro: [d.kickoffChecklist.intro],
        columns: ["Criterio", "Por qué importa"],
        gridCols: "sm:grid-cols-[1.2fr_1.5fr]",
        rows: d.kickoffChecklist.items.map((item) => [item.item, item.why]),
      },
      { kind: "bullets", tone: "callout", heading: d.redFlags.heading, intro: d.redFlags.intro ? [d.redFlags.intro] : undefined, bullets: d.redFlags.bullets, closing: d.redFlags.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildC5(): LessonDoc {
  const d = productionReviewLessonC5;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.productionRules.heading, intro: d.productionRules.intro ? [d.productionRules.intro] : undefined, bullets: d.productionRules.bullets, closing: d.productionRules.closing },
      { kind: "bullets", tone: "card", heading: d.internalReview.heading, intro: [d.internalReview.intro], bullets: d.internalReview.checklist, ordered: true },
      { kind: "rule", label: d.clientFeedbackRule.label, statement: d.clientFeedbackRule.statement, body: d.clientFeedbackRule.body },
      { kind: "bullets", tone: "card", heading: d.versionControl.heading, intro: d.versionControl.intro ? [d.versionControl.intro] : undefined, bullets: d.versionControl.bullets, closing: d.versionControl.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildC6(): LessonDoc {
  const d = dodCreativeLessonC6;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "table",
        heading: d.dodCriteria.heading,
        intro: [d.dodCriteria.intro],
        columns: ["Criterio", "Pregunta de validación"],
        gridCols: "sm:grid-cols-[1fr_2fr]",
        rows: d.dodCriteria.criteria.map((c) => [c.criterion, c.question]),
      },
      {
        kind: "columns",
        heading: d.aestheticsVsMethod.heading,
        items: [
          { title: "Sin método", tone: "neutral" as const, bullets: d.aestheticsVsMethod.aesthetic },
          { title: "Con método", tone: "accent" as const, bullets: d.aestheticsVsMethod.method },
        ],
      },
      { kind: "rule", tone: "warning", label: d.halfDoneRisk.label, statement: d.halfDoneRisk.statement, body: d.halfDoneRisk.body },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildC7(): LessonDoc {
  const d = closingLearningLessonC7;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "steps", heading: d.closingSteps.heading, variant: "numbered", items: d.closingSteps.steps.map((s) => ({ title: s.step, detail: s.detail })) },
      { kind: "bullets", heading: d.learningProtocol.heading, intro: d.learningProtocol.intro ? [d.learningProtocol.intro] : undefined, bullets: d.learningProtocol.bullets, closing: d.learningProtocol.closing },
      { kind: "rule", label: d.continuityRule.label, statement: d.continuityRule.statement, body: d.continuityRule.body },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildC8(): LessonDoc {
  const d = sensitiveInfoLessonC8;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.whatIsSensitive.heading, intro: d.whatIsSensitive.intro ? [d.whatIsSensitive.intro] : undefined, bullets: d.whatIsSensitive.bullets, closing: d.whatIsSensitive.closing },
      { kind: "bullets", tone: "callout", heading: d.handlingRules.heading, intro: d.handlingRules.intro ? [d.handlingRules.intro] : undefined, bullets: d.handlingRules.bullets, closing: d.handlingRules.closing },
      {
        kind: "cards",
        heading: d.breachScenarios.heading,
        flat: true,
        items: d.breachScenarios.scenarios.map((s) => ({ title: s.scenario, fields: [{ label: "Riesgo", text: s.risk, tone: "warning" as const }] })),
      },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildC9(): LessonDoc {
  const d = continuityCLessonC9;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", tone: "card", heading: d.continuityTest.heading, intro: [d.continuityTest.intro], bullets: d.continuityTest.questions, ordered: true },
      {
        kind: "columns",
        items: [
          { title: d.whatBreaksContinuity.heading, tone: "danger" as const, bullets: d.whatBreaksContinuity.bullets },
          { title: d.whatBuildsContinuity.heading, tone: "success" as const, bullets: d.whatBuildsContinuity.bullets },
        ],
      },
      { kind: "rule", tone: "strong", label: d.continuityRule.label, statement: d.continuityRule.statement, body: d.continuityRule.body },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

// ---------------------------------------------------------------------------
// Módulo D · Operación Asesorías
// ---------------------------------------------------------------------------

function buildD1(): LessonDoc {
  const d = advisingMeaningLessonD1;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.whatIsNot.heading, intro: d.whatIsNot.intro ? [d.whatIsNot.intro] : undefined, bullets: d.whatIsNot.bullets, closing: d.whatIsNot.closing },
      { kind: "bullets", heading: d.whatItIs.heading, intro: d.whatItIs.intro ? [d.whatItIs.intro] : undefined, bullets: d.whatItIs.bullets, closing: d.whatItIs.closing },
      { kind: "rule", label: d.complexityRule.label, statement: d.complexityRule.statement, body: d.complexityRule.body },
      { kind: "bullets", heading: d.implications.heading, intro: d.implications.intro ? [d.implications.intro] : undefined, bullets: d.implications.bullets, closing: d.implications.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD2(): LessonDoc {
  const d = conceptualBasesLessonD2;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.whyFrames.heading, intro: d.whyFrames.intro ? [d.whyFrames.intro] : undefined, bullets: d.whyFrames.bullets, closing: d.whyFrames.closing },
      {
        kind: "cards",
        heading: "Cuatro marcos conceptuales base",
        intro: ["Cada marco aporta una lente de análisis distinta. Ninguno reemplaza a los otros."],
        items: d.frameworks.map((fw) => ({
          title: fw.name,
          headerTone: "accent" as const,
          fields: [
            { label: "Idea central", text: fw.coreIdea },
            { label: "Aplicación en THO", text: fw.thoApplication, tone: "accent" as const },
            { label: "Riesgo frecuente", text: fw.keyRisk, tone: "danger" as const },
          ],
        })),
      },
      { kind: "rule", label: d.integrationNote.label, statement: d.integrationNote.statement, body: d.integrationNote.body },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD3(): LessonDoc {
  const d = interventionStructureLessonD3;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "cards",
        items: d.phases.map((phase) => ({
          title: phase.name,
          number: phase.number,
          headerTone: "neutral" as const,
          body: [phase.description],
          fields: [
            { label: "Pregunta clave", text: phase.keyQuestion, tone: "accent" as const },
            { label: "Error frecuente", text: phase.commonError, tone: "danger" as const },
          ],
        })),
      },
      { kind: "rule", tone: "strong", label: d.structureRule.label, statement: d.structureRule.statement, body: d.structureRule.body },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD4(): LessonDoc {
  const d = diagnosisLessonD4;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "rule", label: d.notAccumulation.label, statement: d.notAccumulation.statement, body: d.notAccumulation.body },
      { kind: "bullets", heading: d.tools.heading, intro: d.tools.intro ? [d.tools.intro] : undefined, bullets: d.tools.bullets, closing: d.tools.closing },
      { kind: "bullets", heading: d.interpretiveCriteria.heading, intro: d.interpretiveCriteria.intro ? [d.interpretiveCriteria.intro] : undefined, bullets: d.interpretiveCriteria.bullets, closing: d.interpretiveCriteria.closing },
      {
        kind: "table",
        heading: d.diagnosisOutput.heading,
        intro: [d.diagnosisOutput.intro],
        gridCols: "sm:grid-cols-[1fr_2fr]",
        rows: d.diagnosisOutput.elements.map((el) => [el.name, el.description]),
      },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD5(): LessonDoc {
  const d = strategicDesignLessonD5;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "rule", label: d.coreDistinction.label, statement: d.coreDistinction.statement, body: d.coreDistinction.body },
      { kind: "bullets", heading: d.designPrinciples.heading, intro: d.designPrinciples.intro ? [d.designPrinciples.intro] : undefined, bullets: d.designPrinciples.bullets, closing: d.designPrinciples.closing },
      {
        kind: "table",
        heading: d.alternativesStructure.heading,
        intro: [d.alternativesStructure.intro],
        columns: ["Elemento", "Descripción"],
        gridCols: "sm:grid-cols-[1fr_2fr]",
        rows: d.alternativesStructure.components.map((comp) => [comp.name, comp.description]),
      },
      { kind: "bullets", heading: d.riskLayer.heading, intro: d.riskLayer.intro ? [d.riskLayer.intro] : undefined, bullets: d.riskLayer.bullets, closing: d.riskLayer.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD6(): LessonDoc {
  const d = dodAdvisoryLessonD6;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "table",
        heading: d.universalFloor.heading,
        intro: [d.universalFloor.intro],
        gridCols: "sm:grid-cols-[1fr_2fr]",
        rows: d.universalFloor.elements.map((el) => [el.name, el.description]),
        note: d.universalFloor.closing,
      },
      {
        kind: "cards",
        heading: d.deliverableTypes.heading,
        intro: [d.deliverableTypes.intro],
        columns: 2,
        items: d.deliverableTypes.types.map((type, idx) => ({
          title: type.name,
          headerTone: idx === 0 ? ("accent" as const) : ("neutral" as const),
          fields: [
            { label: "Ejemplos", text: type.examples, tone: "neutral" as const },
            { label: "Lógica de DoD", text: type.dodNote, tone: "accent" as const },
          ],
        })),
      },
      { kind: "rule", tone: "strong", label: d.negotiationRule.label, statement: d.negotiationRule.statement, body: d.negotiationRule.body },
      { kind: "rule", tone: "neutral", label: d.floorRule.label, statement: d.floorRule.statement, body: d.floorRule.body },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD7(): LessonDoc {
  const d = traceabilityLessonD7;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "bullets", heading: d.whyDocument.heading, intro: d.whyDocument.intro ? [d.whyDocument.intro] : undefined, bullets: d.whyDocument.bullets, closing: d.whyDocument.closing },
      { kind: "bullets", heading: d.whatToDocument.heading, intro: d.whatToDocument.intro ? [d.whatToDocument.intro] : undefined, bullets: d.whatToDocument.bullets, closing: d.whatToDocument.closing },
      { kind: "rule", label: d.traceabilityRule.label, statement: d.traceabilityRule.statement, body: d.traceabilityRule.body },
      { kind: "bullets", heading: d.notABurden.heading, intro: d.notABurden.intro ? [d.notABurden.intro] : undefined, bullets: d.notABurden.bullets, closing: d.notABurden.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD8(): LessonDoc {
  const d = ethicsAdvisoryLessonD8;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "cards",
        heading: "Las tres prohibiciones éticas",
        items: d.threeNos.map((item) => ({
          title: item.prohibition,
          headerTone: "danger" as const,
          body: [item.description],
          fields: [{ label: "Consecuencia", text: item.consequence, tone: "neutral" as const }],
        })),
      },
      { kind: "rule", tone: "strong", label: d.legitimacyRule.label, statement: d.legitimacyRule.statement, body: d.legitimacyRule.body },
      { kind: "bullets", heading: d.obligatoryDecline.heading, intro: d.obligatoryDecline.intro ? [d.obligatoryDecline.intro] : undefined, bullets: d.obligatoryDecline.bullets, closing: d.obligatoryDecline.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD9(): LessonDoc {
  const d = advancedFormationLessonD9;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "cards",
        heading: "Tracks de profundización",
        items: d.tracks.map((track) => ({
          title: track.name,
          headerTone: "accent" as const,
          body: [track.description],
          fields: [{ label: "Por qué importa", text: track.whyItMatters, tone: "accent" as const }],
        })),
      },
      { kind: "rule", label: d.formationNote.label, statement: d.formationNote.statement, body: d.formationNote.body },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildD10(): LessonDoc {
  const d = alertSignsLessonD10;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      {
        kind: "cards",
        items: d.alerts.map((alert) => ({
          title: alert.signal,
          icon: "⚠",
          headerTone: "warning" as const,
          body: [alert.description],
          fields: [{ label: "Respuesta correcta", text: alert.correctResponse, tone: "success" as const }],
        })),
      },
      { kind: "rule", tone: "strong", label: d.alertRule.label, statement: d.alertRule.statement, body: d.alertRule.body },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

function buildDCierre(): LessonDoc {
  const d = closingModuleDLesson;
  return {
    label: d.label,
    title: d.title,
    wide: true,
    blocks: [
      { kind: "paragraphs", text: d.premise },
      { kind: "rule", tone: "strong", label: d.coreIdea.label, statement: d.coreIdea.statement, body: d.coreIdea.body },
      { kind: "bullets", heading: d.whatYouNowHave.heading, intro: d.whatYouNowHave.intro ? [d.whatYouNowHave.intro] : undefined, bullets: d.whatYouNowHave.bullets, closing: d.whatYouNowHave.closing },
      { kind: "bullets", heading: d.goingForward.heading, intro: d.goingForward.intro ? [d.goingForward.intro] : undefined, bullets: d.goingForward.bullets, closing: d.goingForward.closing },
      { kind: "synthesis", lines: d.synthesis },
    ],
  };
}

// ---------------------------------------------------------------------------
// Registro
// ---------------------------------------------------------------------------

/**
 * Registro por clave "MÓDULO:ID". A8 no está acá: es interactiva y mantiene
 * su componente propio (LessonA8).
 */
const LESSON_DOC_BUILDERS: Record<string, () => LessonDoc> = {
  "A:A0": buildA0, "A:A1": buildA1, "A:A2": buildA2, "A:A3": buildA3,
  "A:A4": buildA4, "A:A5": buildA5, "A:A6": buildA6, "A:A7": buildA7,
  "B:B1": buildB1, "B:B2": buildB2, "B:B3": buildB3, "B:B4": buildB4,
  "B:B5": buildB5, "B:B6": buildB6, "B:B7": buildB7,
  "C:C1": buildC1, "C:C2": buildC2, "C:C3": buildC3, "C:C4": buildC4,
  "C:C5": buildC5, "C:C6": buildC6, "C:C7": buildC7, "C:C8": buildC8, "C:C9": buildC9,
  "D:D1": buildD1, "D:D2": buildD2, "D:D3": buildD3, "D:D4": buildD4,
  "D:D5": buildD5, "D:D6": buildD6, "D:D7": buildD7, "D:D8": buildD8,
  "D:D9": buildD9, "D:D10": buildD10, "D:DCierre": buildDCierre,
};

const docCache = new Map<string, LessonDoc>();

export function getLessonDoc(moduleKey: string, lessonId: string): LessonDoc | null {
  const key = `${moduleKey}:${lessonId}`;
  const cached = docCache.get(key);
  if (cached) return cached;
  const builder = LESSON_DOC_BUILDERS[key];
  if (!builder) return null;
  const doc = builder();
  docCache.set(key, doc);
  return doc;
}

/** Claves de lecciones data-driven disponibles (para tests/paridad). */
export const LESSON_DOC_KEYS = Object.keys(LESSON_DOC_BUILDERS);
