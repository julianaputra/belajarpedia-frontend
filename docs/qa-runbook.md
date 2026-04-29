# QA Runbook — Belajarpedia Frontend

**Scope:** Pre-launch & per-PR quality gates. Covers SEO regression, a11y,
mobile rendering, performance budget, and acceptance criteria coverage.

---

## 1. Local Testing Cheatsheet

```bash
# Type + lint
npm run typecheck
npm run lint

# Build
npm run build

# E2E (auto-starts dev with mock API)
npm run test:e2e             # all projects (desktop + mobile chromium)
npm run test:e2e:ui          # interactive UI mode
npm run test:e2e:headed      # visible browsers

# Bundle size
npm run analyze              # opens HTML report
```

The Playwright `webServer` block auto-starts `npm run dev` if no server is at
`http://localhost:3000`. To run against an existing dev server, just leave it
running; tests will reuse it.

## 2. Test Files

| File | Purpose | Risk mapped |
|---|---|---|
| `e2e/seo.spec.ts` | title/desc/JSON-LD/breadcrumb/robots per page type | T-01 |
| `e2e/functional.spec.ts` | URL parser 404s, search empty/prompt, mobile, auth gates, public forms | AC-02, AC-04, edge 5.1 |
| `e2e/a11y.spec.ts` | axe-core WCAG 2.1 AA scan on key pages | NFR §6 |

## 3. Acceptance Criteria Coverage

| AC | Verified by | Notes |
|---|---|---|
| AC-01 SSR meta + JSON-LD | `seo.spec.ts` Home/List/Detail | ✓ |
| AC-02 /page/{n} pagination | `functional.spec.ts` pagination beyond last → 404 | ✓ partial; full page-2 traversal needs >50 items in mock filter |
| AC-03 410 for removed | NOT covered E2E (random in mock); covered via 410 handler unit test in detail page route | Backend integration test required |
| AC-04 search noindex | `seo.spec.ts` Search page noindex | ✓ |
| AC-05 card content restricted | Visual review only — no test (would couple to mock). Cards are name+kabkota+image-only by component construction | ✓ by construction |
| AC-07 Timedoor pinned-top | NOT E2E. Mock sorts in handler; backend must enforce via API ordering | Backend test |
| AC-08 hide empty fields | By construction (`<DetailSection>` collapses, `<AttributeRow>` returns null) | ✓ by construction |
| AC-09 conditional map | `<MapEmbed>` returns null when lat/long missing | ✓ by construction |
| AC-10 inquiry form gating | Detail page renders `<InquiryForm>` only when `detail.email` truthy | ✓ by construction |
| AC-13 zero children allowed | Register form schema permits `children: []` (max 20, default empty) | ✓ |
| AC-14 favorite idempotent | Mock uses `Set`; no count surfaced in UI | ✓ |
| AC-15 inquiry rate-limit | Mock doesn't enforce; UI handles 429. **Requires backend integration test** | Backend |
| AC-17 review one-time | Mock allows but UI shows "frozen" state on existing rating; confirm modal works | UI ✓; backend enforces 409 |
| AC-22/23 review constraints | Same as AC-17 — UI flow only | Backend |
| AC-24 review delete recalc | Backend-only (Filament + scoring engine) | Backend |
| US-19 no favorite count | No DOM element shows count | ✓ by construction |
| B-02 14-day grace deletion | Profile page UI mentions "14 hari" before deletion | ✓ |
| B-03 Featured badge | `<FacilityCard>` renders sun-toned badge when `is_timedoor_academy=true` | ✓ |
| B-09 Last verified + Report | Detail page footer; correction form pre-fills URL | ✓ |
| T-02 cache staleness | Webhook tested via curl in `docs/revalidate-webhook.md`. Full ≤5s acceptance test requires backend | Backend integration |

## 4. Manual Lighthouse Audit

Pre-launch, run on key URLs:

```
http://localhost:3000/
http://localhost:3000/sekolah
http://localhost:3000/sekolah/bali/kab-badung
http://localhost:3000/sekolah/bali/kab-badung/kuta-utara/negeri/<known-slug>
http://localhost:3000/login
```

**Procedure**
1. Build production: `npm run build && npm start`
2. Open Chrome → DevTools → Lighthouse tab
3. Mode: Navigation, Device: Mobile (Slow 4G + Mobile CPU throttling)
4. Categories: Performance, Accessibility, Best Practices, SEO
5. Run audit

**Targets per NFR §6.1:**
- Performance ≥ 90 (mobile)
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95
- LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms

If Performance < 90 on any page, run `npm run analyze` to inspect bundle and
identify bloat. Common culprits: large client islands, unoptimized images,
non-tree-shaken libs.

## 5. Bundle Analyzer

```bash
npm run analyze
```

Opens HTML report in browser. Targets:

- **Server bundle**: < 1 MB initial route
- **Client bundle**: < 200 KB First Load JS shared
- **Per-page**: < 50 KB additional

Watch for:
- Mock layer accidentally bundled in production (should be gone in non-mock)
- React Hook Form / Zod imported in too many client islands
- Sentry boot too eager

## 6. Mobile Audit Checklist (Ratna persona, Android mid-range, 4G)

- [ ] All pages render without horizontal scroll at 375px width
- [ ] Touch targets ≥ 44 × 44 px (buttons, nav, card links)
- [ ] Text legible without zoom (body ≥ 16 px, headings hierarchy clear)
- [ ] Forms usable with on-screen keyboard (auto-scroll into view, no overflow)
- [ ] Images load with proper srcset; no layout shift > 0.1
- [ ] Navigation reachable in 1-2 taps from any page
- [ ] Search bar accessible from home; submitting works
- [ ] Detail page hero loads ≤ 2.5s on Slow 4G

## 7. SEO Pre-launch Verification

**Per PR (automated):**
- E2E SEO suite (`seo.spec.ts`) must be green

**Pre-launch (manual, once):**
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Submit `sitemap-{category}-N.xml` files when generated
- [ ] Verify robots.txt at production URL
- [ ] Run https://search.google.com/test/rich-results on detail page
- [ ] Run https://validator.schema.org on JSON-LD output
- [ ] Verify canonicals: detail (none), pagination (self)
- [ ] Verify 410 returns proper status code (test with real backend)

## 8. Test Maintenance

When adding a new page type:
1. Add a SEO assertion in `seo.spec.ts`
2. Add a11y page entry in `a11y.spec.ts`
3. Add functional smoke if it has a unique flow

When changing field rendering on detail:
- Verify `AttributeRow` usage so empty fields stay collapsed (AC-08)

When adding new client-fetched data:
- Mock layer in `src/lib/api/mock/handle.ts` must respond to the new endpoint

## 9. Things E2E Cannot Cover

These need backend or staging integration tests, document for handoff:

- AC-03 410 status code (mock + frontend uses random; needs backend's actual `status=removed` rows)
- AC-15 inquiry 1-per-hour rate-limit (mock doesn't enforce; backend does in Redis)
- AC-17 review 409 on duplicate (mock accepts; backend enforces UNIQUE constraint)
- AC-24 admin review deletion → score recalc (Filament action)
- T-02 ≤5s cache propagation (requires Laravel webhook → revalidate)
- T-05 Sanctum cookie domain in cross-subdomain prod environment

These belong in Phase 12 deployment smoke tests against a staging stack.

## 10. Open Polish Items

### Color contrast audit
Brand primary `#10AF13` + white text yields ~2.3:1 (fails WCAG AA 4.5:1).
Several occurrences across primary buttons, link text on white, etc.

**Decision required with brand stakeholder:**
- Option A — Use `brand-700` (#0A7510, ~5:1) as button bg / link text on white;
  keep `brand-500` for badges, large-display accents, illustration fills.
- Option B — Lighten/darken brand color slightly to land at 4.5:1 (changes
  brand mark).
- Option C — Accept AA failure with documented waiver, target only large-text
  contrast (3:1). Risks downstream audits.

Currently `axe` tests skip the `color-contrast` rule (`e2e/a11y.spec.ts`).
After stakeholder decision, remove the `disableRules(["color-contrast"])` line
and re-assert strict AA compliance.
