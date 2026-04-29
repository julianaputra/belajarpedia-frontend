/**
 * Slug → display name fallback used by breadcrumbs and meta builders when a
 * full region/category record isn't available. e.g. "kab-badung" → "Kab Badung".
 *
 * Phase 5 (home page region selector) will replace these fallbacks with
 * authoritative names from `/api/regions/*`.
 */
export function humanize(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w.length === 0 ? "" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}
