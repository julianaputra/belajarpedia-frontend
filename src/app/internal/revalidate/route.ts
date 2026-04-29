import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * POST /internal/revalidate — On-demand cache invalidation webhook.
 *
 * Called by Laravel after any score- or status-affecting write (T-02 mitigation).
 * The complete event→paths mapping is documented in `docs/revalidate-webhook.md`
 * and Decision §6.5 of `docs/implementation_plan_frontend.md`.
 *
 * Auth: shared secret via `X-Revalidate-Secret` header. Compared via constant-
 *       time string equality to avoid timing leaks.
 *
 * Body: { paths?: string[], tags?: string[] } — at least one must be non-empty.
 *       Each path must be a literal URL starting with `/`. Tags are arbitrary
 *       strings (we use e.g. `facility:sekolah:{slug}`, `facilities:sekolah`).
 *
 * Limits: max 100 entries per array per request. Anything more should be
 *         batched by the caller — sitemap regen alone can exceed otherwise.
 */

const MAX_ENTRIES = 100;

const RUNTIME_OK = !!process.env.REVALIDATE_SECRET;

type Body = {
  paths?: unknown;
  tags?: unknown;
};

export async function POST(req: Request): Promise<Response> {
  if (!RUNTIME_OK) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured on this host." },
      { status: 503 },
    );
  }

  const provided = req.headers.get("x-revalidate-secret");
  const expected = process.env.REVALIDATE_SECRET!;
  if (!provided || !timingSafeEquals(provided, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rawPaths = Array.isArray(body.paths) ? body.paths : [];
  const rawTags = Array.isArray(body.tags) ? body.tags : [];

  if (rawPaths.length === 0 && rawTags.length === 0) {
    return NextResponse.json(
      { error: "Provide at least one of `paths` or `tags`." },
      { status: 400 },
    );
  }

  const summary = {
    revalidated: { paths: [] as string[], tags: [] as string[] },
    skipped: [] as string[],
  };

  for (const p of rawPaths.slice(0, MAX_ENTRIES)) {
    if (typeof p !== "string" || !p.startsWith("/") || p.length > 1024) {
      summary.skipped.push(`invalid_path:${typeof p === "string" ? p : "<non-string>"}`);
      continue;
    }
    try {
      revalidatePath(p);
      summary.revalidated.paths.push(p);
    } catch (e) {
      summary.skipped.push(
        `error_path:${p}:${e instanceof Error ? e.message : "unknown"}`,
      );
    }
  }

  for (const t of rawTags.slice(0, MAX_ENTRIES)) {
    if (typeof t !== "string" || t.length === 0 || t.length > 256) {
      summary.skipped.push(`invalid_tag:${typeof t === "string" ? t : "<non-string>"}`);
      continue;
    }
    try {
      // Next 16: second arg required. "max" = stale-while-revalidate semantics.
      revalidateTag(t, "max");
      summary.revalidated.tags.push(t);
    } catch (e) {
      summary.skipped.push(
        `error_tag:${t}:${e instanceof Error ? e.message : "unknown"}`,
      );
    }
  }

  return NextResponse.json(summary);
}

/** Constant-time string comparison to neutralize timing-based secret guessing. */
function timingSafeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// Disallow other methods explicitly.
export async function GET(): Promise<Response> {
  return new NextResponse("Method Not Allowed", {
    status: 405,
    headers: { Allow: "POST" },
  });
}
