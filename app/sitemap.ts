import type { MetadataRoute } from "next";
import { getSite } from "@/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSite();
  return [
    {
      url: site.meta.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
