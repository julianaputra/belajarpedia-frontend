import type { MetadataRoute } from "next";
import { SITEMAP_SHARD_SIZE } from "@/lib/seo/sitemap-shards";

export async function generateSitemaps(): Promise<{ id: number }[]> {
  // TODO(Phase 3): const total = await fetchUniversitasCountForSitemap();
  const total = 0;
  const shardCount = Math.max(1, Math.ceil(total / SITEMAP_SHARD_SIZE));
  return Array.from({ length: shardCount }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  await props.id;
  // TODO(Phase 3): fetch universitas list/detail URLs for this shard's range.
  return [];
}
