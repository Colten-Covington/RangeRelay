import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return ["", "/explore", "/provider", "/consumer"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-09-15"),
    changeFrequency: path === "" ? "weekly" : "daily",
    priority: path === "" ? 1 : 0.8,
  }));
}
