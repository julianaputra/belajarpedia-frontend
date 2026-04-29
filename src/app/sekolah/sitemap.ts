import type { MetadataRoute } from "next";
import { SITEMAP_SHARD_SIZE } from "@/lib/seo/sitemap-shards";

// Phase 3 will replace these stubs with API-backed counts and URL fetchers.
// For now, generateSitemaps returns a single empty shard so the route compiles.

export async function generateSitemaps(): Promise<{ id: number }[]> {
  // TODO(Phase 3): const total = await fetchSekolahCountForSitemap();
  const total = 0;
  const shardCount = Math.max(1, Math.ceil(total / SITEMAP_SHARD_SIZE));
  return Array.from({ length: shardCount }, (_, i) => ({ id: i }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  await props.id;
  // TODO(Phase 3): fetch sekolah list/detail URLs for this shard's range.
  return [];
}
