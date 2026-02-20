"use client";

import { useState } from "react";

import { LeadMagnet } from "@/components/LeadMagnet";

export function ResourcesModal(props?: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(() => {
    if (!props?.autoOpen) return false;
    if (typeof window === "undefined") return false;
    const key = "tho_resources_modal_seen";
    const seen = window.sessionStorage.getItem(key);
    if (!seen) {
      window.sessionStorage.setItem(key, "1");
      return true;
    }
    return false;
  });

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
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-auto rounded-3xl border border-slate-200 bg-tho-bg p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-tho-title text-[2.1rem] text-slate-950">Recursos prácticos</h3>
                <p className="text-sm text-slate-700">Descarga el manual y empieza a estructurar decisiones con criterio.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
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
