# Mock API Mode (Development)

**Status:** Active until Laravel backend is ready.
**Switch:** Single env var — `NEXT_PUBLIC_USE_MOCK_API`.

---

## How It Works

When `NEXT_PUBLIC_USE_MOCK_API=true`, both `apiServerFetch` (RSC) and
`apiClientFetch` (browser) bypass the network entirely and return canned data
from `src/lib/api/mock/`.

```
fetch path → apiServerFetch / apiClientFetch
              │
              ├─ if NEXT_PUBLIC_USE_MOCK_API=true → mockHandle(path, options)
              │   └─ matched URL? return canned data
              │       no match?     throw 404 ApiError
              │
              └─ else → real fetch to NEXT_PUBLIC_API_BASE_URL
```

The mock layer is invisible to all callers. Pages, server components, hooks,
and SWR keys use the same code as production.

## Switching Off When Backend Is Ready

Edit `.env.local`:

```diff
- NEXT_PUBLIC_USE_MOCK_API=true
+ NEXT_PUBLIC_USE_MOCK_API=false
```

That's the entire change. No code refactor, no import swaps.

For staging/production, omit the var entirely (default is `false`).

## Endpoints Currently Mocked

| Endpoint | Status |
|---|---|
| `GET /api/sekolah` (list + filters + pagination) | ✅ |
| `GET /api/universitas` (list + filters + pagination) | ✅ |
| `GET /api/kursus` (list + filters + Timedoor pin) | ✅ |
| `GET /api/sekolah/search`, etc. | ✅ |
| `GET /api/home/rekomendasi/*` | ✅ |
| `GET /api/regions/provinces`, `/kabkota`, `/kecamatan` | ✅ |
| `GET /api/kursus-categories` | ✅ |
| `GET /api/user` → 401 (logged-out simulation) | ✅ |
| `GET /sanctum/csrf-cookie` → 204 | ✅ |
| `POST /api/logout` → 204 | ✅ |
| Detail endpoints (`/api/sekolah/{...}/{slug}`) | ❌ Phase 4 |
| Auth POST endpoints (login/register/etc.) | ❌ Phase 7 |
| Engagement (favorites, inquiries, reviews) | ❌ Phase 4 |
| Public forms (registration/correction/deletion) | ❌ Phase 8 |

Unmocked endpoints throw `ApiError(404, "MOCK_NOT_IMPLEMENTED")`. As we build
each phase, we extend the mock alongside.

## Mock Data Shape

`src/lib/api/mock/regions.ts` — 3 provinces × 2-3 kabkotas × 2-3 kecamatans
seeded with realistic Indonesian names.

`src/lib/api/mock/facilities.ts` — programmatically generates ~480 sekolah
(8/kecamatan), ~36 universitas (3/kabkota), ~108 kursus (1/category/kecamatan
plus 1 Timedoor/kabkota).

This volume is enough to:
- Test pagination at `/page/2..N`
- Test all filter levels (root → leaf)
- Test Timedoor pinned-top behavior on Kursus
- Test mixed image / placeholder rendering

## Adding a New Mock Endpoint

1. Add canned data to `src/lib/api/mock/{regions,facilities,...}.ts`.
2. Open `src/lib/api/mock/handle.ts` and add a `path === "..."` branch.
3. Match the OpenAPI response shape (use `components["schemas"]["..."]` types).

## Caveats

- Mock pagination uses fixed `PAGE_SIZE = 50` (matches spec AC-04).
- Mock images are Unsplash CDN URLs. Allowed via `next.config.ts` remote
  patterns; **remove that allowance once backend hosts real R2 images**.
- Mock data is regenerated on every server start (deterministic via stable
  seed indexes). No persistence — POSTs to engagement endpoints will be
  acknowledged but not stored.
- Mock layer is bundled into the production build but only activates when
  `NEXT_PUBLIC_USE_MOCK_API=true`. To strip it from prod entirely, we'd add
  a tree-shake guard. For now it's ~30KB gzipped — acceptable while in dev.

## See Also

- `src/lib/api/server.ts` — RSC fetch wrapper (mock-aware)
- `src/lib/api/client.ts` — browser fetch wrapper (mock-aware)
- `src/lib/api/mock/handle.ts` — URL router
- `docs/auth-config.md` — real Sanctum cookie flow (kicks in when mock=false)
