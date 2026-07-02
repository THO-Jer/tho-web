"use client";

import { useEffect, useRef, useState } from "react";

import { LeadMagnet } from "@/components/LeadMagnet";

const RESOURCES_BANNER_SEEN_KEY = "tho_resources_modal_seen";

/**
 * Reemplazo no bloqueante del modal auto-open:
 * un banner compacto que se desliza desde abajo tras unos segundos.
 * El usuario decide si abre el recurso (modal) o lo descarta.
 */
export function ResourcesBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const seen = window.localStorage.getItem(RESOURCES_BANNER_SEEN_KEY);
    if (seen) return;

    const timeoutId = window.setTimeout(() => setShowBanner(true), 6000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const dismiss = () => {
    window.localStorage.setItem(RESOURCES_BANNER_SEEN_KEY, "1");
    setShowBanner(false);
  };

  // Auto-focus y Escape solo cuando el modal está abierto (acción del usuario)
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <>
      {showBanner && !open ? (
        <div className="resources-banner fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:right-6 sm:w-[22rem]">
          <div className="rounded-2xl border border-tho-pink/30 bg-white p-4 shadow-xl shadow-tho-pink/10">
            <div className="mx-0 h-[4px] w-16 rounded-sm bg-tho-pink" aria-hidden />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-tho-pink">
              Recurso gratuito
            </p>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              Manual para la Gestión de la Diversidad (2024)
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Marco conceptual, checklist inicial y errores frecuentes, en PDF.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="btn-unified-motion rounded-xl bg-tho-pink px-4 py-2 text-sm font-bold text-white hover:brightness-110"
              >
                Descargar manual
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Ahora no
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {open ? (
        <div
          className="resource-modal-shell fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Recurso descargable"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpen(false);
              dismiss();
            }
          }}
        >
          <div className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-3xl border border-tho-pink/30 bg-tho-bg p-4 shadow-2xl shadow-tho-pink/10 md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-slate-700">
                Llévate el Manual para la Gestión de la Diversidad (2024) y estructura decisiones con el enfoque THO.
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => {
                  setOpen(false);
                  dismiss();
                }}
                className="btn-unified-motion btn-brand-neutral rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
              >
                Cerrar
              </button>
            </div>
            <LeadMagnet />
          </div>
        </div>
      ) : null}
    </>
  );
}
