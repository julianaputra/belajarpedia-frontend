export const SITEMAP_SHARD_SIZE = 45_000;

export type ShardId = { id: number };

export function shardRange(id: number): { offset: number; limit: number } {
  return { offset: id * SITEMAP_SHARD_SIZE, limit: SITEMAP_SHARD_SIZE };
}
