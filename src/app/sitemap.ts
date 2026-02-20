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
    { url: `${base}/quienes`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/etica`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/nuestra-experiencia`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...SERVICES.map((service) => ({
      url: `${base}/servicios/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
