import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/studio/", "/api/", "/deseos", "/canal-confidencial"],
      },
    ],
    sitemap: "https://tho.cl/sitemap.xml",
    host: "https://tho.cl",
  };
}
