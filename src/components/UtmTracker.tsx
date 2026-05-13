"use client";

import { useEffect } from "react";

import { captureUtm } from "@/lib/utm";

/**
 * Componente sin render. Su único trabajo es ejecutar captureUtm() una vez
 * al montar, así guardamos los parámetros UTM del URL en sessionStorage
 * antes de que el usuario navegue a otra página o llene un formulario.
 *
 * Se incluye en layout.tsx para que corra en todas las rutas.
 */
export function UtmTracker() {
  useEffect(() => {
    captureUtm();
  }, []);

  return null;
}
