"use client";

import Image from "next/image";
import { type RefObject, useEffect, useId, useMemo, useRef, useState } from "react";

import type {
  CardVariant,
  DiagnosticCheckKey,
  LevelRecommendation,
  PageLevel,
  ParagraphSegments,
  Service,
  ServiceAccent,
} from "@/content/services";
import { getUtm } from "@/lib/utm";

type FormStatus = "idle" | "sending" | "ok" | "error";

type RelatedPost = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
};

// ============================================================================
// Accent → Tailwind classes
// ============================================================================
// Tailwind's purge necesita strings literales, así que mantenemos un mapa
// estático para cada accent. Cualquier color nuevo se agrega acá.
// ============================================================================

const ACCENT: Record<
  ServiceAccent,
  {
    heroGradient: string;
    heroRadial: string;
    riskShadow: string;
    riskText: string;
    strongText: string;
    levelKickerSecondary: string;
    levelKickerTertiary: string;
    deliverablesRing: string;
    diagnosticBg: string;
    diagnosticBorder: string;
    diagnosticShadow: string;
    diagnosticItemRing: string;
    diagnosticRecoRing: string;
    diagnosticCheckbox: string;
    diagnosticTone: string;
    formButtonDark: string;
    blogTag: string;
    contactOkText: string;
  }
> = {
  emerald: {
    heroGradient: "from-emerald-900/62 via-slate-900/42 to-emerald-900/40",
    heroRadial:
      "bg-[radial-gradient(circle_at_22%_82%,rgba(163,230,53,0.34),rgba(16,185,129,0.14)_34%,transparent_62%)]",
    riskShadow: "shadow-emerald-950/20",
    riskText: "text-emerald-950 dark:text-emerald-100",
    strongText: "text-[#0f4e2f] dark:text-emerald-300",
    levelKickerSecondary: "text-emerald-800",
    levelKickerTertiary: "text-emerald-900",
    deliverablesRing: "ring-emerald-700/15",
    diagnosticBg:
      "bg-[linear-gradient(160deg,#f8fce9_0%,#f0f8d9_65%,#e6f2c5_100%)] dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.96)_0%,rgba(20,83,45,0.7)_100%)]",
    diagnosticBorder: "border-emerald-300/70 dark:border-emerald-400/30",
    diagnosticShadow: "shadow-emerald-900/10",
    diagnosticItemRing: "ring-emerald-700/10",
    diagnosticRecoRing: "ring-emerald-700/20",
    diagnosticCheckbox: "text-emerald-700 focus:ring-emerald-600",
    diagnosticTone: "text-emerald-800 dark:text-emerald-300",
    formButtonDark: "dark:bg-emerald-400 dark:text-slate-900",
    blogTag: "text-tho-green",
    contactOkText: "text-emerald-200",
  },
  orange: {
    heroGradient: "from-orange-900/62 via-slate-900/42 to-orange-900/40",
    heroRadial:
      "bg-[radial-gradient(circle_at_22%_82%,rgba(251,146,60,0.34),rgba(249,115,22,0.14)_34%,transparent_62%)]",
    riskShadow: "shadow-orange-950/20",
    riskText: "text-orange-950 dark:text-orange-100",
    strongText: "text-[#9a3412] dark:text-orange-300",
    levelKickerSecondary: "text-orange-800",
    levelKickerTertiary: "text-orange-900",
    deliverablesRing: "ring-orange-700/15",
    diagnosticBg:
      "bg-[linear-gradient(160deg,#fff7ed_0%,#ffedd5_65%,#fdba74_100%)] dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.96)_0%,rgba(154,52,18,0.65)_100%)]",
    diagnosticBorder: "border-orange-300/70 dark:border-orange-400/30",
    diagnosticShadow: "shadow-orange-900/10",
    diagnosticItemRing: "ring-orange-700/10",
    diagnosticRecoRing: "ring-orange-700/20",
    diagnosticCheckbox: "text-orange-700 focus:ring-orange-600",
    diagnosticTone: "text-orange-800 dark:text-orange-300",
    formButtonDark: "dark:bg-orange-400 dark:text-slate-900",
    blogTag: "text-orange-600",
    contactOkText: "text-orange-200",
  },
  indigo: {
    heroGradient: "from-indigo-900/62 via-slate-900/42 to-indigo-900/40",
    heroRadial:
      "bg-[radial-gradient(circle_at_22%_82%,rgba(129,140,248,0.34),rgba(99,102,241,0.18)_34%,transparent_62%)]",
    riskShadow: "shadow-indigo-950/20",
    riskText: "text-indigo-950 dark:text-indigo-100",
    strongText: "text-[#3730a3] dark:text-indigo-300",
    levelKickerSecondary: "text-indigo-800",
    levelKickerTertiary: "text-indigo-900",
    deliverablesRing: "ring-indigo-700/15",
    diagnosticBg:
      "bg-[linear-gradient(160deg,#eef2ff_0%,#e0e7ff_65%,#a5b4fc_100%)] dark:bg-[linear-gradient(160deg,rgba(15,23,42,0.96)_0%,rgba(67,56,202,0.65)_100%)]",
    diagnosticBorder: "border-indigo-300/70 dark:border-indigo-400/30",
    diagnosticShadow: "shadow-indigo-900/10",
    diagnosticItemRing: "ring-indigo-700/10",
    diagnosticRecoRing: "ring-indigo-700/20",
    diagnosticCheckbox: "text-indigo-700 focus:ring-indigo-600",
    diagnosticTone: "text-indigo-800 dark:text-indigo-300",
    formButtonDark: "dark:bg-indigo-400 dark:text-slate-900",
    blogTag: "text-indigo-600",
    contactOkText: "text-indigo-200",
  },
};

const CARD_VARIANT_CLASS: Record<CardVariant, string> = {
  green: "service-feature-card--green",
  orange: "service-feature-card--orange",
  pink: "service-feature-card--pink",
};

// ============================================================================
// Helpers
// ============================================================================

/**
 * Renderiza un párrafo segmentado: items en índices impares → <strong> con clase de énfasis.
 */
function renderParagraphSegments(segments: ParagraphSegments, strongClass: string) {
  return segments.map((segment, idx) => {
    if (idx % 2 === 1) {
      return (
        <strong key={idx} className={strongClass}>
          {segment}
        </strong>
      );
    }
    return <span key={idx}>{segment}</span>;
  });
}

/**
 * Mismas reglas de recomendación que las 3 views originales — el contenido
 * de cada estado lo provee el data per-service.
 */
function pickRecommendation(
  checks: Record<DiagnosticCheckKey, boolean>,
  recs: Service["pageContent"]["recommendations"],
): LevelRecommendation {
  const score = Object.values(checks).filter(Boolean).length;
  if (score === 0) return recs.empty;
  if (checks.alreadyExecuting && score >= 3) return recs.implementation;
  if (score >= 3 || checks.governanceGaps) return recs.strategy;
  return recs.diagnostic;
}

// ============================================================================
// Sub-components
// ============================================================================

function LevelCard({
  level,
  accent,
  cardClass,
  onBrochureClick,
  triggerRef,
}: {
  level: PageLevel;
  accent: ServiceAccent;
  cardClass: string;
  onBrochureClick: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  const accentClasses = ACCENT[accent];
  const isPrimary = level.variant === "primary";
  const kickerColor =
    level.variant === "tertiary"
      ? accentClasses.levelKickerTertiary
      : accentClasses.levelKickerSecondary;

  return (
    <article
      className={`service-feature-card ${cardClass} esg-level-card rounded-[2.1rem] p-6 text-slate-900 dark:text-slate-100 ${
        isPrimary ? "esg-level-card--start relative" : ""
      }`}
    >
      {isPrimary ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ilustraciones/3.png"
            alt="Ilustración de inicio"
            className="pointer-events-none absolute right-4 top-4 w-14 opacity-95"
          />
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {level.kicker}
          </p>
          <h4 className="mt-4 text-3xl font-black leading-[1.02] text-slate-900">{level.name}</h4>
          {level.summary ? (
            <p className="mt-3 text-sm text-slate-900 dark:text-slate-200">{level.summary}</p>
          ) : null}
        </>
      ) : (
        <>
          <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${kickerColor}`}>
            {level.kicker}
          </p>
          <h4 className="mt-2 text-2xl font-black text-slate-900">{level.name}</h4>
        </>
      )}

      <ul
        className={`mt-4 space-y-2 text-sm text-slate-900 ${
          isPrimary ? "dark:text-slate-100" : "dark:text-slate-200"
        }`}
      >
        {level.bullets.map((bullet) => (
          <li key={bullet}>• {bullet}</li>
        ))}
      </ul>

      {level.deliverables ? (
        <div
          className={`mt-5 rounded-xl bg-white/70 p-4 ring-1 ${accentClasses.deliverablesRing} dark:bg-slate-900/80 dark:ring-white/15`}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
            Entregables
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-slate-900 dark:text-slate-200">
            {level.deliverables.map((d) => (
              <li key={d}>✓ {d}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {level.closingTagline ? (
        <p className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-100">
          {level.closingTagline}
        </p>
      ) : null}

      {isPrimary ? (
        <button
          ref={triggerRef}
          type="button"
          onClick={onBrochureClick}
          className="btn-unified-motion btn-hero-services mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
        >
          Descargar brochure
        </button>
      ) : null}
    </article>
  );
}

// ============================================================================
// Main component
// ============================================================================

export function ServicePage({
  service,
  relatedPosts = [],
}: {
  service: Service;
  relatedPosts?: RelatedPost[];
}) {
  const { pageContent: content, brochureFile } = service;
  const accent = ACCENT[content.accent];
  const cardClass = CARD_VARIANT_CLASS[content.cardClass];

  const [openBrochure, setOpenBrochure] = useState(false);
  const [brochureStatus, setBrochureStatus] = useState<FormStatus>("idle");
  const [contactStatus, setContactStatus] = useState<FormStatus>("idle");
  const [riskParallax, setRiskParallax] = useState(0);
  const brochureTriggerRef = useRef<HTMLButtonElement>(null);
  const [levelChecks, setLevelChecks] = useState<Record<DiagnosticCheckKey, boolean>>({
    noMaterialityMap: false,
    investorPressure: false,
    governanceGaps: false,
    shortDeadline: false,
    alreadyExecuting: false,
  });

  const revealItems = useMemo(
    () => [
      `${content.contactSectionId}-hero-copy`,
      `${content.contactSectionId}-hero-cta`,
      `${content.contactSectionId}-statement`,
      `${content.contactSectionId}-context`,
      `${content.contactSectionId}-levels`,
      `${content.contactSectionId}-faq`,
      `${content.contactSectionId}-contact`,
    ],
    [content.contactSectionId],
  );
  const dialogTitleId = useId();

  const recommendation = useMemo(
    () => pickRecommendation(levelChecks, content.recommendations),
    [levelChecks, content.recommendations],
  );

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setRiskParallax(Math.max(-12, Math.min(22, y * 0.03)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!openBrochure) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenBrochure(false);
        // Restaurar foco al botón que abrió el modal
        brochureTriggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [openBrochure]);

  async function onBrochureSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBrochureStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      type: "brochure_download",
      eventLabel: content.brochureEventLabel,
      source: content.brochureSource,
      resourceId: content.brochureResourceId,
      resourceName: content.brochureResourceName,
      serviceSlug: service.slug,
      serviceName: service.navLabel,
      levelId: content.brochureLevelId,
      levelName: content.brochureLevelName,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("organization") || ""),
      message: `Cargo: ${String(form.get("role") || "")}`,
      pageUrl: window.location.href,
      hp: String(form.get("hp") || ""),
      utm: getUtm(),
    };
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return setBrochureStatus("error");
    setBrochureStatus("ok");

    const link = document.createElement("a");
    link.href = brochureFile;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    e.currentTarget.reset();
  }

  async function onContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setContactStatus("sending");
    const form = new FormData(e.currentTarget);
    const payload = {
      type: "contact",
      eventLabel: content.contactEventLabel,
      source: content.contactSource,
      resourceId: content.contactResourceId,
      resourceName: content.contactResourceName,
      serviceSlug: service.slug,
      serviceName: service.navLabel,
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("organization") || ""),
      message: `Cargo: ${String(form.get("role") || "")}\n\n${String(form.get("message") || "")}`,
      pageUrl: window.location.href,
      hp: String(form.get("hp") || ""),
      utm: getUtm(),
    };
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setContactStatus(res.ok ? "ok" : "error");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <main className="esg-page bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* HERO */}
      <section className="esg-hero relative min-h-[84vh] overflow-hidden">
        <Image
          src={content.heroImage}
          alt={content.heroAlt}
          fill
          className="object-cover object-center"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${accent.heroGradient}`} />
        <div className={`absolute inset-0 ${accent.heroRadial}`} />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white dark:to-slate-950" />

        <div className="relative mx-auto flex min-h-[84vh] max-w-6xl items-end px-4 pb-16 pt-24 md:pb-24">
          <div className="max-w-3xl text-white">
            <div className="esg-reveal is-visible" data-reveal-id={revealItems[0]}>
              <h1 className="font-tho-title text-[2.7rem] leading-[0.98] md:text-[5rem]">
                {content.heroTitleLines.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < content.heroTitleLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h1>
              <div className="brand-block-divider mt-4 h-[6px] w-36 rounded-sm" />
              <p className="mt-5 max-w-[700px] text-base text-white/90 md:text-lg">
                {content.heroSubtitle}
              </p>
            </div>
            <a
              href={`#${content.contactSectionId}`}
              className="btn-unified-motion btn-hero-services esg-reveal is-visible relative z-10 mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:text-slate-900"
              data-reveal-id={revealItems[1]}
            >
              ¡Danos detalles!
            </a>
          </div>
        </div>
      </section>

      {/* CONTEXT + RISK PANEL */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div
          className="esg-reveal is-visible grid gap-8 md:grid-cols-[0.95fr_1.05fr]"
          data-reveal-id={revealItems[3]}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {content.contextEyebrow}
            </p>
            <div className="brand-block-divider mt-3 mb-6 h-[6px] w-36 rounded-sm" />
            {content.contextParagraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className={`${idx === 0 ? "" : "mt-4"} text-base leading-relaxed text-slate-700 md:text-lg dark:text-slate-300`}
              >
                {renderParagraphSegments(paragraph, accent.strongText)}
              </p>
            ))}
          </div>

          <aside
            className={`esg-risk-glass relative rounded-[2rem] border border-white/35 bg-white/25 p-7 text-slate-900 shadow-2xl ${accent.riskShadow} ring-1 ring-white/40 backdrop-blur-xl dark:border-white/15 dark:bg-white/8 dark:text-white dark:ring-white/10`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/ilustraciones/7.png"
              alt="Ilustración de acompañamiento"
              className="pointer-events-none absolute -right-10 -top-12 w-44 opacity-100 md:w-48"
              style={{ transform: `translateY(${riskParallax}px)` }}
            />
            <h3
              className={`font-tho-title -mt-1 max-w-[84%] text-[2.35rem] leading-[0.95] md:-mr-8 md:text-[3.35rem] ${accent.riskText}`}
            >
              {content.riskHeadline}
            </h3>
            <ul className="mt-6 space-y-2 text-sm text-slate-800 md:text-base dark:text-slate-100">
              {content.riskBullets.map((bullet) => (
                <li key={bullet}>• {bullet}</li>
              ))}
            </ul>
            <p className={`mt-5 text-sm font-semibold md:text-base ${accent.riskText}`}>
              {content.riskTagline}
            </p>
          </aside>
        </div>
      </section>

      {/* LEVELS */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="esg-reveal is-visible" data-reveal-id={revealItems[4]}>
          <h3 className="font-tho-title text-[2.1rem] text-slate-900 md:text-[3.2rem] dark:text-slate-100">
            Niveles de intervención
          </h3>
          <div className="brand-block-divider mt-3 mb-8 h-[6px] w-36 rounded-sm" />

          <div className="esg-level-grid esg-levels-gallery grid gap-5 md:grid-cols-3">
            {content.levels.map((level) => (
              <LevelCard
                key={level.name}
                level={level}
                accent={content.accent}
                cardClass={cardClass}
                onBrochureClick={() => {
                  setOpenBrochure(true);
                  setBrochureStatus("idle");
                }}
                triggerRef={level.variant === "primary" ? brochureTriggerRef : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ + DIAGNOSTIC */}
      <section className="bg-slate-50 px-4 py-20 dark:bg-slate-900/70">
        <div className="esg-reveal is-visible mx-auto max-w-6xl" data-reveal-id={revealItems[5]}>
          <div className="grid gap-5 md:grid-cols-[1fr_0.95fr] md:items-start">
            <div>
              <h3 className="font-tho-title text-left text-[2.2rem] text-slate-900 md:text-[3.4rem] dark:text-slate-100">
                {content.faqStartTitle}
              </h3>
              <div className="brand-block-divider mt-3 mb-8 h-[6px] w-36 rounded-sm" />

              <div className="grid gap-4">
                {content.faqs.map((item) => (
                  <details
                    key={item.q}
                    className="faq-item rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80"
                  >
                    <summary className="faq-summary flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-slate-900 dark:text-slate-100">
                      {item.q}
                      <span className="faq-chevron shrink-0 text-slate-400" aria-hidden>▾</span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <aside className="relative md:-mt-4 md:-mr-4">
              <div
                className={`rounded-3xl border ${accent.diagnosticBorder} ${accent.diagnosticBg} p-6 shadow-xl ${accent.diagnosticShadow}`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600 dark:text-slate-300">
                  {content.diagnosticEyebrow}
                </p>
                <h4 className="mt-2 text-2xl font-black leading-[1.02] text-slate-900 dark:text-slate-100">
                  ¿Por cuál nivel conviene partir?
                </h4>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                  Marca las condiciones que aplican hoy en tu organización y te sugerimos un punto de entrada.
                </p>

                <div className="mt-5 grid gap-3">
                  {content.diagnosticChecks.map(({ key, label }) => (
                    <label
                      key={key}
                      className={`flex items-start gap-3 rounded-xl bg-white/70 px-3 py-2 text-sm text-slate-800 ring-1 ${accent.diagnosticItemRing} dark:bg-slate-900/60 dark:text-slate-100 dark:ring-white/10`}
                    >
                      <input
                        type="checkbox"
                        checked={levelChecks[key]}
                        onChange={(e) =>
                          setLevelChecks((prev) => ({ ...prev, [key]: e.target.checked }))
                        }
                        className={`mt-0.5 h-4 w-4 rounded border-slate-400 ${accent.diagnosticCheckbox}`}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div
                  className={`mt-5 rounded-2xl bg-white/80 p-4 ring-1 ${accent.diagnosticRecoRing} dark:bg-slate-900/80 dark:ring-white/10`}
                >
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Resultado sugerido
                  </p>
                  <p className={`mt-1 text-base font-bold ${accent.diagnosticTone}`}>
                    {recommendation.level}
                  </p>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                    {recommendation.hint}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* RELATED POSTS */}
      {relatedPosts.length ? (
        <section className="bg-white px-4 py-16 dark:bg-slate-950">
          <div className="mx-auto max-w-6xl">
            <h3 className="font-tho-title text-[2rem] text-slate-900 md:text-[2.8rem] dark:text-slate-100">
              Lecturas relacionadas
            </h3>
            <div className="brand-block-divider mt-3 mb-8 h-[6px] w-36 rounded-sm" />
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.slice(0, 3).map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="service-brochure-link flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                >
                  <p className={`text-xs font-semibold uppercase tracking-wide ${accent.blogTag}`}>
                    Blog · {post.tags.slice(0, 2).join(" · ")}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {post.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Leer artículo
                    <span className="service-brochure-arrow" aria-hidden>→</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* CONTACT */}
      <section
        id={content.contactSectionId}
        className="bg-white px-4 py-20 dark:bg-slate-950"
      >
        <div className="esg-reveal is-visible mx-auto max-w-6xl" data-reveal-id={revealItems[6]}>
          <div className="rounded-[2rem] bg-slate-950 px-6 py-10 text-white ring-1 ring-slate-800 md:px-8 md:py-12">
            <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div>
                <h3 className="font-tho-title text-[2.4rem] text-white md:text-[3.5rem]">
                  ¿Comenzamos?
                </h3>
                <p className="mt-4 max-w-xl text-lg text-white/85">{content.contactIntro}</p>
              </div>

              <form
                onSubmit={onContactSubmit}
                className="grid gap-3 rounded-3xl bg-slate-900/70 p-5 ring-1 ring-white/10"
              >
                <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
                <input
                  name="name"
                  required
                  placeholder="Nombre"
                  className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15"
                />
                <input
                  name="role"
                  placeholder="Cargo"
                  className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15"
                />
                <input
                  name="organization"
                  placeholder="Organización"
                  className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email"
                  className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Mensaje"
                  className="rounded-xl bg-white/12 px-4 py-3 text-sm text-white placeholder:text-white/50 ring-1 ring-white/15"
                />
                <button
                  disabled={contactStatus === "sending"}
                  className="btn-unified-motion btn-hero-services mt-2 inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 disabled:opacity-60"
                >
                  {contactStatus === "sending" ? "Enviando..." : "Enviar solicitud"}
                </button>
                {contactStatus === "ok" ? (
                  <p aria-live="polite" className={`text-sm ${accent.contactOkText}`}>
                    Gracias, te contactaremos pronto.
                  </p>
                ) : null}
                {contactStatus === "error" ? (
                  <p aria-live="polite" className="text-sm text-rose-200">
                    No pudimos enviar, intenta nuevamente.
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* BROCHURE MODAL */}
      {openBrochure ? (
        <div
          className="fixed inset-0 z-[90] grid place-items-center bg-slate-900/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={dialogTitleId}
          onClick={() => setOpenBrochure(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            role="document"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h4
                id={dialogTitleId}
                className="text-xl font-semibold text-slate-900 dark:text-slate-100"
              >
                Descargar brochure
              </h4>
              <button
                type="button"
                onClick={() => {
                  setOpenBrochure(false);
                  brochureTriggerRef.current?.focus();
                }}
                className="rounded-lg border border-slate-200 px-3 py-1 text-sm dark:border-slate-600 dark:text-slate-200"
              >
                Cerrar
              </button>
            </div>
            <form onSubmit={onBrochureSubmit} className="mt-4 grid gap-3">
              <input name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
              <input
                name="name"
                required
                placeholder="Nombre"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                name="role"
                placeholder="Cargo"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                name="organization"
                required
                placeholder="Organización"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                disabled={brochureStatus === "sending"}
                className={`rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 ${accent.formButtonDark}`}
              >
                {brochureStatus === "sending" ? "Enviando..." : "Descargar brochure"}
              </button>
            </form>
            {brochureStatus === "ok" ? (
              <p aria-live="polite" className={`mt-3 text-sm ${accent.diagnosticTone}`}>
                ¡Listo! Te abrimos el brochure en una pestaña nueva. Si tu navegador la bloqueó,{" "}
                <a
                  href={brochureFile}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline"
                >
                  ábrelo aquí
                </a>
                . Registramos tu solicitud.
              </p>
            ) : null}
            {brochureStatus === "error" ? (
              <p aria-live="polite" className="mt-3 text-sm text-rose-600">
                No pudimos procesar tu solicitud, intenta de nuevo.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </main>
  );
}
