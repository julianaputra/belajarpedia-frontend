import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1,
      lastModified: new Date(),
    },
  ];
}
