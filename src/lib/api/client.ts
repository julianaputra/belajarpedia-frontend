import "client-only";

import { ApiError, type ApiErrorPayload } from "@/lib/api/error";
import { apiUrl } from "@/lib/api/config";

export type ClientFetchOptions = Omit<RequestInit, "body" | "credentials"> & {
  body?: unknown;
};

let csrfPrimed = false;

/**
 * Browser-side fetch helper.
 *
 * - Always uses `credentials: "include"` so Sanctum session cookies travel
 *   with the request (frontend & API share the parent domain).
 * - Auto-primes the Sanctum CSRF cookie on the first mutation.
 * - Echoes `XSRF-TOKEN` cookie back as `X-XSRF-TOKEN` header.
 * - Throws `ApiError` on non-2xx.
 */
export async function apiClientFetch<T>(
  path: string,
  options: ClientFetchOptions = {},
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const isMutation = method !== "GET" && method !== "HEAD";

  if (isMutation) {
    await ensureCsrfCookie();
  }

  const { body, headers: hdrs, ...rest } = options;
  const headers = new Headers(hdrs);
  headers.set("accept", "application/json");
  if (body !== undefined && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  const xsrf = readCookie("XSRF-TOKEN");
  if (xsrf && !headers.has("x-xsrf-token")) {
    headers.set("x-xsrf-token", decodeURIComponent(xsrf));
  }

  const res = await fetch(apiUrl(path), {
    ...rest,
    method,
    credentials: "include",
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

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

/**
 * Prime Sanctum's CSRF cookie. Idempotent — only the first call hits the
 * network; subsequent calls return immediately. The cookie itself is set by
 * the API (HttpOnly=false) so the browser can read it and echo it back.
 */
export async function ensureCsrfCookie(force = false): Promise<void> {
  if (csrfPrimed && !force) return;
  const res = await fetch(apiUrl("/sanctum/csrf-cookie"), {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new ApiError(res.status, { message: "Failed to obtain CSRF cookie" });
  }
  csrfPrimed = true;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const prefix = `${encodeURIComponent(name)}=`;
  for (const part of document.cookie.split("; ")) {
    if (part.startsWith(prefix)) return part.slice(prefix.length);
  }
  return undefined;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
