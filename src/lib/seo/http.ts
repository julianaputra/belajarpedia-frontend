import { notFound } from "next/navigation";

/**
 * Trigger a 404 response for missing facilities or invalid hierarchical paths.
 * Wraps Next's notFound() so call sites read consistently.
 */
export function throwNotFound(): never {
  notFound();
}

/**
 * 410 Gone is used for soft-deleted facilities (status=removed) per AC-03.
 *
 * Next.js App Router does not expose a built-in `gone()` navigation helper, so
 * the convention for this codebase is:
 *
 *   1. Detect `status === "removed"` in the page's data fetcher (Phase 4).
 *   2. Render the <GoneNotice /> client UI (Phase 4) inside the same route.
 *   3. In a Route Handler sibling (e.g. `app/sekolah/[[...path]]/route.ts`)
 *      we set `Response.status = 410` for direct GETs that match a known
 *      removed slug. The page UI mirrors the 410 status visually.
 *
 * In practice the data fetcher returns `{ status: "removed", facility }` and
 * the page component renders the gone UI; ISR cache key continues to work.
 */
export function goneResponse(message = "This facility has been removed."): Response {
  return new Response(message, {
    status: 410,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "x-robots-tag": "noindex",
    },
  });
}
