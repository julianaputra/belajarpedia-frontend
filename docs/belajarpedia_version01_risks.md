# Belajarpedia — Risks and Mitigations (v01)

**Project:** Belajarpedia
**Version:** 01
**Date:** 2026-04-28

---

## 1. Risk Matrix

Severity scale: **Low** (manageable inconvenience) · **Medium** (delays / partial outage) · **High** (data loss, SEO collapse, or launch-blocking).
Likelihood scale: **Low** (<20%) · **Medium** (20–60%) · **High** (>60%).

### 1.1 Technical Risks

| ID | Risk | Likelihood | Severity |
|---|---|---|---|
| T-01 | SEO regression from client-only rendering of critical content | Medium | **High** |
| T-02 | ISR cache staleness causing reviews/inquiries to not reflect on detail pages | Medium | Medium |
| T-03 | Slug collision logic generates duplicate slugs under concurrent imports | Low | High |
| T-04 | Score recalculation race condition under concurrent reviews/inquiries | Medium | Medium |
| T-05 | Sanctum cookie domain misconfigured between `belajarpedia.com` and `api.belajarpedia.com` | Medium | High |
| T-06 | Excel importer accepts malformed data and silently corrupts facilities | Medium | High |
| T-07 | Google Maps API key abused (key extracted from page source) | High | Low |
| T-08 | R2 bucket accidentally exposed as writable / images publicly mutable | Low | High |
| T-09 | MySQL `score` column drifts out of sync with `inquiries_count` / `favorites_count` / `review_score_total` | Medium | Medium |
| T-10 | Birthday batch double-sends if scheduler retries | Low | Medium |
| T-11 | Sitemap grows past Google's 50k-URL limit as data scales | Low | Medium |
| T-12 | LIKE-based search becomes slow at tens-of-thousands record scale | Medium | Medium |
| T-13 | Slug-immutability rule violated by accident in admin or import | Low | High |
| T-14 | Cloudflare Turnstile blocks legitimate users on slow connections | Medium | Low |
| T-15 | Image hotlink protection breaks `next/image` requests | Medium | Medium |

### 1.2 Operational Risks

| ID | Risk | Likelihood | Severity |
|---|---|---|---|
| O-01 | Annual data refresh introduces breaking errors that go live unreviewed (scraped/imported data is auto-published) | High | Medium |
| O-02 | Admin team lacks training on Excel template, leading to bad imports | High | Medium |
| O-03 | Deletion-request form abused to remove competitor facilities | Medium | Medium |
| O-04 | Inquiry inbox accumulates unprocessed items because no SLA assigned | High | Low |
| O-05 | Birthday email sender reputation damaged if facility emails bounce frequently | Medium | Medium |
| O-06 | Facility owners email Timedoor with corrections via inquiry form, but staff misroute them | Medium | Low |
| O-07 | No clear owner for ongoing kursus category curation | Medium | Medium |
| O-08 | `is_timedoor_academy` flag set incorrectly by import, hiding/promoting facilities wrongly | Medium | High |
| O-09 | MySQL backup not tested for restoration | High | High |
| O-10 | Production deploy collides with admin doing a bulk import | Medium | Medium |

### 1.3 Business / Compliance Risks

| ID | Risk | Likelihood | Severity |
|---|---|---|---|
| B-01 | Facility owner files take-down complaint / cease-and-desist over scraped data | Medium | High |
| B-02 | UU PDP (Indonesian data protection law) compliance gap on user PII (children's birthdates) | Medium | High |
| B-03 | Promotional placement of Timedoor Academy violates fair-display expectations and damages site credibility | Medium | Medium |
| B-04 | Search-engine penalty for thin-content list pages (zero-result handling, near-duplicates) | Medium | High |
| B-05 | Google algorithm update reduces directory site visibility | Medium | High |
| B-06 | Site is mistaken for a paid-ranking service due to score-driven sorting | Low | Medium |
| B-07 | Trademark issue with using "Belajarpedia" name | Low | High |
| B-08 | Inquiry-email content violates anti-spam laws if recipient hasn't opted in | Medium | Medium |
| B-09 | Educational data inaccuracy (wrong tuition, accreditation) leads to user complaints | High | Medium |

---

## 2. Mitigation Strategies

### Technical

- **T-01 — SEO regression.** All list, detail, and search pages render through Server Components with explicit `dynamic = 'force-static'` + `revalidate = 3600`. Add a Playwright SEO suite that asserts `<title>`, `<meta name="description">`, JSON-LD `@type`, and BreadcrumbList presence on representative pages of each type, run on every PR. Use `view-source:` spot-checks pre-launch via Lighthouse + Google's Rich Results test.

- **T-02 — Cache staleness.** Every score-affecting Laravel write enqueues a `RevalidateRoutesJob` that POSTs to a Next.js API route protected by a shared secret; that route calls `revalidatePath` for the facility's detail URL plus its three parent list URLs. Acceptance test: post a review via API and confirm the new state is visible within 5s on the detail page.

- **T-03 — Slug collisions.** The slug generator runs inside a DB transaction with a `SELECT … FOR UPDATE` on slug rows matching the prefix, increments suffix, then inserts. Importer processes rows sequentially within a single job, not in parallel. Add a Pest test that races 50 facilities with the same base name through the generator concurrently and asserts uniqueness.

- **T-04 — Score race conditions.** Wrap every score-affecting write in `DB::transaction()` with `lockForUpdate()` on the `facilities` row. The score is recalculated from the same row's `inquiries_count`, `favorites_count`, `review_score_total` after they're incremented in the same transaction — never from outside aggregates. Add a Pest test that fires 100 concurrent favorites and confirms the final score is exact.

- **T-05 — Sanctum cookie domain.** Document the `SESSION_DOMAIN=.belajarpedia.com` and `SANCTUM_STATEFUL_DOMAINS=belajarpedia.com` settings in the deployment runbook. Add a smoke test in CI that hits `/sanctum/csrf-cookie` from the Next.js host and confirms the `XSRF-TOKEN` cookie is set with the correct `Domain` attribute.

- **T-06 — Importer data corruption.** Two-phase import: validate-only step writes nothing; commit step runs in a single transaction with a savepoint per row, rolling back the failing row but proceeding. Validation checks: required fields, allowed dropdowns, region slug resolution, valid lat/long range, valid email/URL, character-length limits. Import generates a downloadable error CSV and a summary diff report admin must approve before commit.

- **T-07 — Maps API key abuse.** Restrict the API key by HTTP referrer (`*.belajarpedia.com/*`) in the Google Cloud Console. Cap daily quota. Add billing alerts at $10 and $50/month. Use a separate dev key with a low cap for local development.

- **T-08 — R2 misconfiguration.** R2 bucket public read-only for `images/*`; write access only via the Laravel server-side Workers API token. Bucket policy reviewed and added to the deployment checklist. Quarterly security audit script attempts an unauthenticated PUT and asserts 403.

- **T-09 — Score column drift.** Add a nightly Laravel artisan command `score:audit` that recomputes scores from raw counts and compares to stored values; alerts on any mismatch and writes a fixup migration. Wrap all writes in transactions (per T-04).

- **T-10 — Birthday batch double-send.** `birthday_mail_logs` has `UNIQUE(user_id, sent_at_date)` and `UNIQUE(user_child_id, sent_at_date)`. The batch checks the log first and skips already-sent recipients. Job is dispatched once via the scheduler with `withoutOverlapping()`.

- **T-11 — Sitemap > 50k URLs.** Implement sitemap-index from day one: `sitemap.xml` references `sitemap-sekolah-1.xml`, `sitemap-universitas-1.xml`, etc., each capped at 45k URLs. Generation logic auto-shards.

- **T-12 — LIKE search slowness.** Add MySQL FULLTEXT indexes on `facilities(name, address, description)` as a fallback path; LIKE remains primary for AND-keyword semantics, but the worker compiles to `MATCH … AGAINST(... IN BOOLEAN MODE)` when input has 3+ tokens. Benchmark at 50k facility seed in staging.

- **T-13 — Slug immutability violation.** DB-level: drop UPDATE privileges on `facilities.slug` from the application user (Laravel uses a separate migration role for schema). Filament form: render slug field as read-only after initial save. Importer: explicitly excludes `slug` from the UPDATE column list.

- **T-14 — Turnstile false positives.** Use Turnstile's "managed" mode (invisible by default, falls back to challenge only on suspicious traffic). Provide a fallback flow: after 3 verification failures show a human-readable error with a "contact support" link.

- **T-15 — Image hotlink false positives.** Configure R2 + Cloudflare to allow referrers from `belajarpedia.com` and the Next.js Vercel-style image optimizer requests. Test image rendering on every PR via Playwright visual diff.

### Operational

- **O-01 — Auto-publish bad data.** Importer's preview step REQUIRES admin to type "COMMIT" (or click an enabled-on-clean-validation button) before write. Add a 24-hour rollback capability: every import writes a `import_runs` record with the diff payload (JSON) so an admin can run `import:rollback {run_id}`.

- **O-02 — Admin training.** Provide a one-page operator runbook (PDF) plus an in-Filament tour the first time the import page is opened. Each sheet's `README` row explains its column. The downloadable error CSV is annotated with the line number and human-readable error.

- **O-03 — Deletion-request abuse.** Deletion requests go to the unified inquiry inbox in Filament with status "Unprocessed"; admin must explicitly click "Approve & Soft-Delete" or "Reject." No automation; never auto-delete from a public form. Log the requester's IP and email.

- **O-04 — Inbox SLA.** Define a 5-business-day SLA for unified inquiry inbox processing. Filament dashboard widget shows count of items past SLA. Daily 09:00 email summary sent to operations lead.

- **O-05 — Email bounce reputation.** SendGrid event webhook ingested into `mail_logs.status` (delivered / bounced / dropped). Soft-bounce facility emails after 3 hard bounces: flag the facility's email field as `email_disabled_at` and hide the inquiry form on those facilities until an admin re-validates.

- **O-06 — Inquiry routing.** Filament inquiry inbox has a required "Type" column; the public form's "Type" field maps directly. Admins filter by type. Document tagging convention in operator runbook.

- **O-07 — Category ownership.** Designate a single Operations team member as kursus-category-owner; that person is the only Filament user with category create/disable/delete permissions (separate Filament role).

- **O-08 — Wrong is_timedoor_academy flag.** Excel importer rejects any non-`kursus` row where `is_timedoor_academy=TRUE`. Filament adds a confirmation modal ("This will pin the facility to the top of all Kursus lists. Confirm?") whenever the flag is set on a single facility.

- **O-09 — Untested backups.** Quarterly disaster-recovery drill: restore latest backup to a staging instance, run smoke-test suite, document time-to-recover. Drill report archived in operations folder.

- **O-10 — Deploy/import collision.** Filament import page sets a `import_in_progress` Redis key for the duration of a commit; deploy script checks the key and aborts with a clear message until the import is done. Inverse: import page disables the Commit button if a deploy lock is held.

### Business / Compliance

- **B-01 — Facility take-down.** Provide a clearly visible "Request Removal" form on every detail page (footer link). Honor requests within 7 business days. Maintain a removed-facility audit log in case of dispute. For Phase 2 scraping, respect `robots.txt` and standard scraping etiquette; legal review before scraper goes live.

- **B-02 — UU PDP (data protection).** Implement a publicly accessible privacy policy describing what user PII is collected (including children's birthdates, used solely for birthday emails) and provide a self-service account-deletion endpoint that hard-deletes user + children + favorites + reviews + birthday logs after a 14-day grace period. Encrypt children's data column at rest.

- **B-03 — Timedoor promotion fairness.** Add a small but visible "Sponsored" / "Featured Partner" badge to Timedoor Academy entries on Kursus lists and home Rekomendasi. Document in the Privacy / About page that Belajarpedia is operated by Timedoor and that Timedoor Academy entries receive featured placement.

- **B-04 — Thin-content SEO penalty.** Zero-result list pages already `noindex` and excluded from sitemap. Add a minimum-content threshold for indexable list pages: if total = 0, `noindex`; if 1–2 facilities, render with deeper context (region description + parent breadcrumbs + cross-links) to avoid thin-content classification.

- **B-05 — Google algorithm risk.** Monitor Google Search Console weekly for the first 3 months post-launch and monthly thereafter. Maintain a content-quality checklist for facility detail pages (description ≥ 200 chars, ≥ 3 attribute fields populated). Diversify traffic sources: maintain a YouTube/Instagram presence linking back.

- **B-06 — Pay-to-rank perception.** Sort logic is documented but never user-visible (no "popular" / "ranking" labels per the requirements). About page explicitly states: "Belajarpedia does not accept payment for placement."

- **B-07 — Trademark.** Trademark search "Belajarpedia" with DJKI before launch. Register the mark if available.

- **B-08 — Anti-spam on inquiries.** Inquiry email body explicitly states the user submitted it through Belajarpedia, includes the user's full message, and provides clear identification of the sender. Reply-To set to user's email so recipients can respond directly. Maintain a suppression list — facilities can request to never receive Belajarpedia inquiries; that disables the form for them.

- **B-09 — Data accuracy.** Detail pages display a "Last verified: {date}" footer reflecting the most recent admin edit or import. Detail page always includes a "Report incorrect information" link → unified inquiry inbox. Annual refresh process documented as the primary accuracy mechanism.

---

## 3. Priority Mitigation Roadmap

| Phase | Mitigations to land before |
|---|---|
| **Pre-launch (blocking)** | T-01, T-03, T-04, T-05, T-06, T-08, T-13, O-01, O-08, B-02, B-03, B-07 |
| **Launch week** | T-02, T-09, T-10, O-04, O-09, B-04, B-08 |
| **First 90 days** | T-11, T-12, T-15, O-02, O-05, O-07, B-05, B-09 |
| **Ongoing** | T-07, T-14, O-03, O-06, O-10, B-01, B-06 |
