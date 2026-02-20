import type { MetadataRoute } from "next";

import { SERVICES } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tho-web.vercel.app";
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SERVICES.map((service) => ({
      url: `${base}/soluciones/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
