# Auth Configuration — Sanctum SPA Cookies

**Date:** 2026-04-29
**Scope:** Cookie domain, CSRF flow, and per-environment env vars for the
Belajarpedia frontend ↔ Laravel API boundary.

---

## 1. Domain & Env Per Environment

| Env | Frontend | API | `SESSION_DOMAIN` | `SANCTUM_STATEFUL_DOMAINS` |
|---|---|---|---|---|
| Local | `localhost:3000` | `localhost:8000` | `localhost` | `localhost:3000` |
| Staging | `staging.belajarpedia.com` | `api.staging.belajarpedia.com` | `.staging.belajarpedia.com` | `staging.belajarpedia.com` |
| Production | `belajarpedia.com` | `api.belajarpedia.com` | `.belajarpedia.com` | `belajarpedia.com` |

The leading dot on `SESSION_DOMAIN` is what allows the cookie to be visible to
both `belajarpedia.com` (Next.js) and `api.belajarpedia.com` (Laravel).

In Laravel `.env`:

```
APP_URL=https://api.belajarpedia.com
SESSION_DRIVER=cookie
SESSION_DOMAIN=.belajarpedia.com
SESSION_SECURE_COOKIE=true        # prod & staging only
SESSION_SAME_SITE=lax
SANCTUM_STATEFUL_DOMAINS=belajarpedia.com
```

In Next.js `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 2. CSRF Flow (Sanctum SPA)

Sanctum uses the standard Laravel session + CSRF cookie pattern, but the
client must explicitly prime the CSRF cookie before the first mutation.

```
┌──────────┐    1. GET /sanctum/csrf-cookie       ┌──────────┐
│ Browser  │  ────────────────────────────────▶  │   API    │
│          │  ◀──────  Set-Cookie: XSRF-TOKEN  ── │          │
│          │                                      │          │
│          │    2. POST /api/login                │          │
│          │    Cookie: XSRF-TOKEN=...            │          │
│          │    X-XSRF-TOKEN: ...                 │          │
│          │  ────────────────────────────────▶  │          │
│          │  ◀──────  200 + session cookie  ──── │          │
└──────────┘                                      └──────────┘
```

`apiClientFetch` (in `src/lib/api/client.ts`) handles this automatically —
the first mutation invokes `ensureCsrfCookie()` once per page load, and the
`XSRF-TOKEN` cookie is read and echoed in the `X-XSRF-TOKEN` header on every
mutating request.

For Server Components (`apiServerFetch`), incoming request cookies are
forwarded as-is; the XSRF token is also re-echoed as a header so write
operations from Route Handlers still pass CSRF validation.

## 3. CORS

Laravel `config/cors.php` for staging/prod:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register'],
'allowed_methods' => ['*'],
'allowed_origins' => [env('FRONTEND_URL', 'https://belajarpedia.com')],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,  // critical — sends Access-Control-Allow-Credentials
```

The browser will refuse to send cookies on `fetch(..., { credentials: "include" })`
unless `supports_credentials` is true AND `allowed_origins` is an explicit
origin (not `*`).

## 4. CI Smoke Test (T-05 Mitigation)

Before launch we add a CI smoke test that:

1. Hits `${API_BASE_URL}/sanctum/csrf-cookie` from the FE host context.
2. Asserts the `Set-Cookie` response header includes `Domain=.belajarpedia.com`.
3. Asserts `SameSite=Lax` and `Secure` (prod/staging) flags are present.

If this fails, end-user logins will silently break. T-05 is High Severity —
keep this smoke test red-and-yellow visible in the deploy pipeline.

## 5. Common Pitfalls

| Symptom | Likely cause |
|---|---|
| 419 CSRF mismatch on POST | XSRF-TOKEN cookie not yet primed; call `ensureCsrfCookie()` first |
| 401 on `/api/user` after login | `SESSION_DOMAIN` mismatch between FE and API |
| Login works locally but not in staging | Missing trailing dot on `SESSION_DOMAIN` (`.staging.belajarpedia.com`) |
| `credentials: "include"` doesn't send cookie | CORS `supports_credentials` is false, or `allowed_origins` is `*` |
| Cookie set but not sent on next request | Browser blocked it — likely `Secure` flag missing on http:// or `SameSite=None` without `Secure` |

## 6. Why Server-Component Fetch Forwards Cookies

When a logged-in user requests an SSR page (`/profile`, `/favorites`), the
Next.js server fetches `/api/user` from inside its node process — the
browser is not in the loop. We manually pull `cookies()` from the incoming
request and attach them as the `Cookie` header on the outbound API call.

This is wired in `src/lib/api/server.ts:apiServerFetch`:

```ts
const cookieStore = await cookies();
headers.set("cookie", cookieStore.toString());
const xsrf = cookieStore.get("XSRF-TOKEN")?.value;
if (xsrf) headers.set("x-xsrf-token", decodeURIComponent(xsrf));
```

Without this forwarding, every SSR page would see the user as logged out.
