// Esta ruta fue movida a /studio/canal-confidencial/panel
// Este archivo existe solo para compatibilidad con bookmarks anteriores.
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudioIncidentesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/studio/canal-confidencial/panel");
  }, [router]);
  return null;
}
