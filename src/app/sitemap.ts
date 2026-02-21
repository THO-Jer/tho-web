import type { MetadataRoute } from "next";

import { SERVICES } from "@/content/services";
import { listPublishedPosts } from "@/lib/blogStore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://tho-web.vercel.app";
  const now = new Date();
  const posts = await listPublishedPosts();

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
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...SERVICES.map((service) => ({
      url: `${base}/servicios/${service.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
