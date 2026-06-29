import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bepifbenblkqjuplvylh.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        // Redirección propia al calendario de agendamiento.
        // Cambiar el destination aquí cuando se migre de proveedor de booking.
        source: "/agendar",
        destination: "https://bit.ly/bookTHO",
        permanent: false, // 307 — permite cambiar el destino sin que el browser cachee
      },
      {
        // /soluciones era el slug anterior de /servicios.
        // 301 permanente para preservar cualquier link externo o indexación residual.
        source: "/soluciones/:slug*",
        destination: "/servicios/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
