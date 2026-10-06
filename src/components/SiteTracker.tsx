"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { isTrackablePath } from "@/lib/webChannels";
import { trackNavigation } from "@/lib/webTracking";

/**
 * Sin render. Registra visitas y páginas vistas de todo el sitio público
 * (Studio y el canal confidencial quedan fuera). Se monta en layout.tsx.
 */
export function SiteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || !isTrackablePath(pathname)) return;
    const result = trackNavigation(pathname);
    if (!result || (!result.newVisit && !result.countPage)) return;

    const body = {
      path: result.path,
      visit: result.newVisit ? { channel: result.newVisit.channel, source: result.newVisit.source } : null,
      page: result.countPage,
    };

    fetch("/api/web/hit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
