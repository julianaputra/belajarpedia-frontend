import "server-only";

import { cookies } from "next/headers";
import { ApiError, type ApiErrorPayload } from "@/lib/api/error";
import { apiUrl } from "@/lib/api/config";
import { mockHandle, useMockApi } from "@/lib/api/mock/handle";

export type ServerFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  /** Override Next's default fetch cache (e.g. "no-store" for user-scoped data). */
  cache?: RequestCache;
  /** Pass-through for Next.js ISR revalidate. */
  revalidate?: number | false;
  /** Pass-through for Next.js cache tags. */
  tags?: string[];
};

/**
 * Server-side fetch helper for use in Server Components and Route Handlers.
 *
 * - Forwards incoming request cookies (Sanctum session + XSRF) to the Laravel API.
 * - Throws `ApiError` for non-2xx responses; callers map 404→notFound() etc.
 * - JSON request/response by default.
 *
 * Example:
 *   const sekolah = await apiServerFetch<SekolahDetail>("/api/sekolah/...");
 */
export async function apiServerFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  if (useMockApi) {
    return mockHandle<T>(path, {
      method: options.method,
      body: options.body,
    });
  }

  const { body, headers: hdrs, revalidate, tags, cache, ...rest } = options;
  const headers = new Headers(hdrs);
  headers.set("accept", "application/json");
  if (body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();
  if (cookieHeader) headers.set("cookie", cookieHeader);

  const xsrf = cookieStore.get("XSRF-TOKEN")?.value;
  if (xsrf && !headers.has("x-xsrf-token")) {
    headers.set("x-xsrf-token", decodeURIComponent(xsrf));
  }

  const init: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
    ...rest,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  };
  if (cache) init.cache = cache;
  if (revalidate !== undefined || tags) {
    init.next = {
      ...(revalidate !== undefined ? { revalidate } : {}),
      ...(tags ? { tags } : {}),
    };
  }

  const res = await fetch(apiUrl(path), init);

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  const json = text ? safeJson(text) : undefined;

  if (!res.ok) {
    const payload: ApiErrorPayload =
      json && typeof json === "object" ? (json as ApiErrorPayload) : { message: text };
    throw new ApiError(res.status, payload);
  }

  return (json ?? (undefined as unknown)) as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
