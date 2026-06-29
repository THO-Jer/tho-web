"use client";

import { useEffect, useRef, useState } from "react";

import { LeadMagnet } from "@/components/LeadMagnet";

const RESOURCES_MODAL_SEEN_KEY = "tho_resources_modal_seen";

export function ResourcesModal(props?: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!props?.autoOpen) return;

    const seen = window.localStorage.getItem(RESOURCES_MODAL_SEEN_KEY);
    if (seen) return;

    // BUG FIX: marcar como visto solo cuando realmente se muestra,
    // no antes del timeout (antes el usuario podía salir sin verlo).
    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(RESOURCES_MODAL_SEEN_KEY, "1");
      setOpen(true);
    }, 6000); // aumentado de 3.5s a 6s para no interrumpir al usuario de inmediato

    return () => window.clearTimeout(timeoutId);
  }, [props?.autoOpen]);

  // Auto-focus el botón de cerrar al abrir el modal
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  // Cerrar con Escape
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
      {!props?.autoOpen ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-unified-motion btn-brand-neutral rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-900"
        >
          Recursos prácticos
        </button>
      ) : null}

      {open ? (
        <div
          className="resource-modal-shell fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Recurso descargable"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-3xl border border-tho-blue/30 bg-tho-bg p-4 shadow-2xl shadow-tho-blue/10 md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-700">Llévate el manual y estructura decisiones con el enfoque THO.</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
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
