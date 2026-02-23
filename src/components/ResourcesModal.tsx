"use client";

import { useEffect, useState } from "react";

import { LeadMagnet } from "@/components/LeadMagnet";

const RESOURCES_MODAL_SEEN_KEY = "tho_resources_modal_seen";

export function ResourcesModal(props?: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!props?.autoOpen) return;

    const seen = window.localStorage.getItem(RESOURCES_MODAL_SEEN_KEY);
    if (seen) return;

    window.localStorage.setItem(RESOURCES_MODAL_SEEN_KEY, "1");

    const timeoutId = window.setTimeout(() => {
      setOpen(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [props?.autoOpen]);

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
        <div className="resource-modal-shell fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-3xl overflow-auto rounded-3xl border border-tho-blue/30 bg-tho-bg p-4 shadow-2xl shadow-tho-blue/10 md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-slate-700">Llévate el manual y estructura decisiones con el enfoque THO.</p>
              </div>
              <button
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
