# Belajarpedia — Implementation Plan: Public Site (Next.js)

**Project:** Belajarpedia — Educational Institution Directory for Indonesia
**Scope:** Public-facing site (Next.js only). Admin panel (Filament) and Laravel API are out of scope and consumed via REST.
**Version:** 01
**Date:** 2026-04-29

---

## 1. Stack & Architecture Decisions

| Area | Pilihan | Alasan (mengacu spec/risks) |
|---|---|---|
| Framework | Next.js 14+ App Router, RSC default | SSR mandatory untuk SEO (T-01 High) |
| Language | TypeScript strict | Codegen dari `belajarpedia_version01_api.yaml` |
| Styling | Tailwind CSS + shadcn/ui (recommended) | Sudah disebut spec; cepat & a11y-ready |
| Forms | react-hook-form + zod | Mirror validasi Laravel |
| Data fetching | `fetch()` native (RSC) + SWR (client) | RSC untuk list/detail; SWR untuk Rekomendasi & user state |
| Auth | Sanctum SPA cookies | Forward `cookies()` dari RSC ke `api.belajarpedia.com` |
| Caching | ISR `revalidate: 3600` + on-demand `revalidatePath` | Per spec §1.1 |
| Images | `next/image` + custom R2 loader | T-15 mitigation |
| Maps | Google Maps iframe (referrer-locked) | T-07 mitigation |
| Bot protection | Cloudflare Turnstile (managed mode) | T-14 mitigation |
| Monitoring | Sentry (FE) | NFR §6 |
| Tests | Playwright (E2E + SEO assertions) | T-01 mitigation |

## 2. Project Structure

```
src/
  app/
    layout.tsx                       # Root layout, header, footer
    page.tsx                         # Home (3 sections + Rekomendasi client islands)
    sekolah/
      [[...path]]/page.tsx           # List + leaf list + pagination + detail
      search/page.tsx                # noindex
    universitas/
      [[...path]]/page.tsx
      search/page.tsx
    kursus/
      [[...path]]/page.tsx
      search/page.tsx
    (auth)/login | register | verify-email | forgot-password | reset-password
    (account)/profile | favorites
    (forms)/submit-listing | request-correction | request-removal
    api/
      revalidate/route.ts            # Internal webhook (X-Revalidate-Secret)
    sitemap.xml/route.ts             # Sitemap index (sharded, T-11)
    sitemap-[category]-[n].xml/route.ts
    robots.ts
    not-found.tsx
  components/{cards,layout,seo,forms,home,facility-detail}/
  lib/
    api/                             # Typed client (codegen from OpenAPI)
    seo/{meta,jsonld,breadcrumbs}.ts
    routing/{url-builder,url-parser}.ts
  types/api.ts                       # openapi-typescript output
```

**Routing strategy**: optional catch-all `[[...path]]` per category. Satu route handler memparse path dan memutuskan: root list / region list / leaf list / pagination / detail / 410 / 404. Lebih maintainable daripada nested folders 5 level × 3 kategori.

## 3. Phased Roadmap (~32 hari kerja)

### Phase 0 — Setup (1 hari)
- `create-next-app` dengan TS+Tailwind+App Router
- Codegen types: `openapi-typescript docs/belajarpedia_version01_api.yaml`
- Env: `NEXT_PUBLIC_API_BASE_URL`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_GMAPS_KEY`, `SENTRY_DSN`
- `next.config.js`: image loader R2, security headers, revalidate config
- ESLint + Prettier + Husky pre-commit (typecheck + lint)

### Phase 1 — SEO Foundation (3 hari) **← prioritas tertinggi (T-01)**
- `lib/seo/meta.ts` — title/description templates (root, region, leaf, detail, search, home, zero-result)
- `lib/seo/jsonld.ts` — builder untuk `School` / `CollegeOrUniversity` / `EducationalOrganization` + `BreadcrumbList`
- `<JsonLd>` server component (script tag, escaped)
- `<Breadcrumbs>` UI dengan source data sama
- `app/robots.ts`, `app/sitemap.xml/route.ts` (sitemap index, sharded ≤45k URL/file)
- Canonical policy: detail = none; pagination = self-referencing; search = self-canonical
- 410 handler: response status di route handler (untuk soft-deleted)
- 404 via `not-found.tsx`
- **Playwright SEO suite** wajib lulus sebelum lanjut: assert `<title>`, meta desc, JSON-LD `@type`, BreadcrumbList di setiap page type

### Phase 2 — API Client + Auth Plumbing (2 hari)
- `lib/api/client.ts`: typed fetch wrapper, forward cookies dari RSC, credentialed di client
- Sanctum CSRF flow helper (`getCsrfCookie()` dipanggil sebelum POST/PATCH/DELETE)
- `useCurrentUser()` hook (SWR, revalidateOnFocus)
- Konfigurasi domain cookie (`SESSION_DOMAIN=.belajarpedia.com`) terdokumentasi
- CI smoke test: GET `/sanctum/csrf-cookie` set `XSRF-TOKEN` dengan domain benar (T-05)

### Phase 3 — List Pages (4 hari)
- URL parser hierarkikal (parse `[[...path]]` → `{level, params, page}`)
- Per-category list fetcher (RSC, `revalidate: 3600`)
- `<FacilityCard>` — hanya name, kabkota, image (AC-05; tidak ada score/count/chip)
- Pagination component (`/page/{n}`, 50/page, AC-02)
- Zero-result + thin-content handling (B-04, edge case 5.1): `noindex`, exclude sitemap
- Timedoor pinned-top di Kursus list (AC-07)
- Default placeholder image
- Mobile-first responsive grid

### Phase 4 — Detail Pages (5 hari)
- Per-category detail RSC (Sekolah / Universitas / Kursus)
- Conditional rendering: hide empty fields & empty section headers (AC-08)
- Google Maps iframe only when lat/long present (AC-09)
- Inquiry form rendered only when `email` present (AC-10)
- Auth-gated client islands: Favorite button, Inquiry form, Review widget
- Review confirmation modal ("one-time, no re-rating", AC-17)
- "Sponsored / Featured Partner" badge untuk `is_timedoor_academy` (B-03)
- "Last verified" footer + "Report incorrect information" link (B-09)
- Turnstile integration di inquiry & review submit (managed mode)
- 410 response untuk facility removed

### Phase 5 — Home Page (2 hari)
- Hero + fixed SEO description block
- 3 sections (Sekolah / Universitas / Kursus) dengan region/category nav
- `<RekomendasiSection>` client component, fetch `/api/home/rekomendasi/*` dengan `cache: 'no-store'` (cache bypass per spec)
- Cascading province → kabkota dropdowns (fetch dari `/api/regions/*`)
- Search bar dengan category dropdown wajib

### Phase 6 — Search Pages (2 hari)
- `/{category}/search?q=...`
- `<meta robots="noindex">` (AC-04)
- Self-referencing canonical, excluded from sitemap
- 50/page pagination

### Phase 7 — Auth Flows (4 hari)
- Register: email+password+profile+children+Turnstile (US-12, US-14, US-17 = 0 children allowed)
- Login: email+password OR Google OAuth redirect (US-13, AC-12)
- Email verification landing
- Password reset request + reset
- Profile editor (self + children CRUD)
- Account deletion 14-hari grace (B-02 / UU PDP)

### Phase 8 — Public Forms (1 hari)
- Submit Listing / Correction / Removal forms — semua Turnstile-gated (US-35..37)
- Correction form prefill `facility_url` dari detail page

### Phase 9 — User Account Pages (1 hari)
- `/favorites` list, `/profile` editor

### Phase 10 — Revalidation Webhook (2 hari)
- `app/api/revalidate/route.ts` — verifikasi `X-Revalidate-Secret`, panggil `revalidatePath` untuk array paths
- Acceptance test: POST review via API → state baru tampak ≤5s di detail page (T-02)

### Phase 11 — Performance + QA (3 hari)
- Lighthouse: target ≥90 di Performance/SEO/A11y (NFR 6.1)
- Bundle analyzer; pastikan client bundle minimal (RSC default)
- Mobile audit (Android mid-range, 4G — persona Ratna)
- Playwright E2E full pass: rate-limit inquiry (AC-15), one-time review (AC-17), pagination 404, 410 removed
- Visual diff untuk image rendering R2 (T-15)
- Accessibility audit (gunakan skill `accessibility-compliance`)

### Phase 12 — Deploy + Launch Prep (2 hari)
- GitHub Actions: lint + typecheck + Playwright on PR
- Tag-driven deploy ke AWS via SSH/rsync (per spec)
- Cloudflare maintenance Worker
- Sentry release tagging
- Operator runbook (verifikasi revalidation, rollback)

## 4. Risk → Phase Cross-Reference

| Risk | Severity | Mitigated in |
|---|---|---|
| T-01 SEO regression | High | Phase 1 (foundation) + Phase 11 (Playwright SEO suite) |
| T-02 Cache staleness | Med | Phase 10 (revalidate webhook + ack test) |
| T-05 Sanctum cookie domain | High | Phase 2 (CI smoke test) |
| T-07 Maps key abuse | Low | Phase 4 (referrer-locked key + billing alert) |
| T-11 Sitemap >50k URLs | Med | Phase 1 (sharded sitemap-index hari pertama) |
| T-14 Turnstile false positive | Low | Phase 7 (managed mode + fallback flow) |
| T-15 Image hotlink | Med | Phase 0 (loader) + Phase 11 (visual diff) |
| B-02 UU PDP | High | Phase 7 (account deletion + privacy policy) |
| B-03 Pay-to-rank perception | Med | Phase 4 + 5 (Sponsored badge) |
| B-04 Thin-content SEO | High | Phase 3 (noindex zero-result + min-content threshold) |
| B-09 Data accuracy | Med | Phase 4 (last-verified + report link) |

## 5. Out of Scope (Frontend)

The following are Laravel/Filament concerns and consumed only via REST:
- Admin panel (Filament 3)
- Excel import / validation / commit
- Score recalculation engine
- Email dispatch (SendGrid)
- Slug generation & uniqueness
- Database schema & migrations
- Birthday batch (05:00 daily)
- SendGrid event webhook ingestion
- Queue workers / scheduler

Frontend hanya mengonsumsi API per `belajarpedia_version01_api.yaml`.

## 6. Open Questions

1. **Hosting**: spec menyebut AWS EC2/Lightsail. Apakah Vercel boleh dipertimbangkan? Vercel = ISR + on-demand revalidation native, tapi spec mengikat ke AWS shared host (NFR 6.4 backup).
2. **UI kit**: shadcn/ui (recommended), atau ada brand kit Belajarpedia yang sudah ada?
3. **Translation**: spec bilang Bahasa Indonesia only — confirm semua copy di Indonesia, gunakan `lang="id"` di `<html>`.
4. **Slug pagination**: spec menyebut `/page/{n}` — ini bagian dari path, bukan query. Confirm route shape: `/sekolah/bali/page/2` (path-segment, bukan `?page=2`).
5. **Revalidate granularity**: webhook menerima paths array — perlu spec list URL patterns mana yang harus diinvalidate per facility-edit (detail + 3 parent list).
6. **Domain cookie split**: dev/staging/prod — perlu env-driven `SESSION_DOMAIN` config.

## 7. References

- `docs/belajarpedia_version01_prd.md` — User stories, acceptance criteria, edge cases
- `docs/belajarpedia_version01_spec.md` — Tech stack, modules, NFR
- `docs/belajarpedia_version01_risks.md` — Risk matrix & mitigations
- `docs/belajarpedia_version01_api.yaml` — OpenAPI 3.0 contract
