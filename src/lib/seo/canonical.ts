import { absoluteUrl } from "@/lib/site/config";

/**
 * Canonical policy for Belajarpedia, per spec §6.6 + AC-02 + AC-04:
 *
 * - Detail pages         → no canonical (Next.js default; URL is unique).
 * - List pages           → no canonical at /page/1; self-referencing at /page/n (n ≥ 2).
 * - Search pages         → self-referencing canonical (always noindex).
 * - Zero-result lists    → noindex; canonical still self-references.
 * - URLs with query junk → query stripped from canonical (path only).
 *
 * Used by `meta.ts` builders. Pages should not call these directly unless they
 * need a non-standard override.
 */

export function listCanonical(path: string, page: number | undefined): string | undefined {
  if (!page || page <= 1) return undefined;
  return absoluteUrl(stripQuery(path));
}

export function selfCanonical(path: string): string {
  return absoluteUrl(stripQuery(path));
}

function stripQuery(path: string): string {
  const q = path.indexOf("?");
  return q >= 0 ? path.slice(0, q) : path;
}
