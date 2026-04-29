# Belajarpedia — Product Requirements Document (v01)

**Project:** Belajarpedia — Educational Institution Directory for Indonesia
**Version:** 01
**Date:** 2026-04-28

---

## 1. User Personas

### 1.1 Primary — Ratna, the Searching Parent (35–48)
A parent of one or more school-age children, lives in a Tier-1 or Tier-2 Indonesian city. Searches Google for things like *"sekolah swasta terbaik di Denpasar"* or *"kursus coding anak Denpasar"*. Lands on Belajarpedia from organic search.

- **Goals:** Compare a small shortlist (3–5) of nearby schools or kursus, see realistic information about cost, curriculum/program, and location, contact the institution to ask questions.
- **Frustrations:** Most directory sites bury contact info, push paid listings, or are crammed with ads. Information is often outdated. Hard to compare side-by-side because every site has a different layout.
- **Context of use:** Mobile (Android, mid-range device, on a 4G connection) for quick browsing in the evening; desktop when she gets serious about shortlisting.

### 1.2 Primary — Doni, the High-School Student (16–18)
A student researching universitas or kursus options for himself.

- **Goals:** Find universities matching his target program (S1 Informatika, e.g.), figure out which ones are in his region or worth traveling for, find a kursus to prep for SBMPTN.
- **Frustrations:** Information about admission paths (jalur masuk) is scattered across many sites. Comparing biaya across institutions is painful.
- **Context of use:** Mobile-first, often during school breaks; will register and favorite multiple institutions for later comparison.

### 1.3 Secondary — Ibu Sari, the Belajarpedia Operator (Timedoor staff)
Operations team member responsible for keeping facility data accurate and processing inquiries from the unified inbox.

- **Goals:** Run the annual data refresh quickly and confidently; clear inquiry inbox each week; correct factual errors when reported.
- **Frustrations:** Spreadsheet imports are scary because a typo can break many records; previous tools didn't show what would change before committing.
- **Context of use:** Desktop only; uses Filament admin daily.

### 1.4 Secondary — Pak Budi, the Kursus Owner (40–55)
Runs a small kursus operation. Discovers Belajarpedia because parents start mentioning it.

- **Goals:** Submit his kursus for listing, request corrections to inaccurate information, opt out if he doesn't want to be listed.
- **Frustrations:** Most directories don't have a clear contact path for institution owners.
- **Context of use:** Visits the public site, finds the registration / correction / deletion form in the footer.

### 1.5 Tertiary — Site Administrator (Timedoor lead)
The single super-admin who manages Filament users, audit trails, and structural changes (kursus category taxonomy).

- **Goals:** Maintain operational integrity, audit any data changes, manage operator accounts and permissions.

---

## 2. User Stories — by module

### 2.1 Discovery & Browsing

- **US-01** As Ratna, I want to land on the home page and immediately understand that this site has Sekolah, Universitas, and Kursus information, so that I know I'm in the right place.
- **US-02** As Ratna, I want to pick a province and kabupaten/kota and see a list of schools in that area, so that I can browse without typing.
- **US-03** As Doni, I want to type a keyword like "informatika" and search within Universitas, so that I get results scoped to higher education only.
- **US-04** As any visitor, I want each list page to show 50 facilities and let me paginate through more, so that I can scan a meaningful chunk at a time.
- **US-05** As any visitor, I want the URL of a list page to be human-readable (e.g., `/sekolah/bali/kab-badung/kuta-utara/negeri/`), so that I can recognize and bookmark or share it.
- **US-06** As Doni, I want list cards to show only the facility name, city, and image, so that I'm not biased by popularity scores or ratings before I look at details.

### 2.2 Detail & Decision

- **US-07** As Ratna, I want a detail page that shows me everything available for a school (cost, curriculum, accreditation, hours, facilities, address, contact), with empty fields hidden, so that I see complete-looking information without misleading "N/A" gaps.
- **US-08** As Ratna, I want a map showing the school's location when coordinates are available, so that I can judge how far it is from home.
- **US-09** As Doni, I want a Universitas detail page to list the faculties and programs available, so that I can confirm my target major exists.
- **US-10** As Ratna, I want a clear "Send Inquiry" button on the detail page, but only if the institution accepts contact via email, so that I'm not led to a dead form.
- **US-11** As Doni, I want a Kursus detail page to clearly show its main category and any sub-categories, so that I understand what they teach.

### 2.3 Authentication

- **US-12** As Ratna, I want to register with my email and a password, so that I can save favorites and contact institutions.
- **US-13** As Doni, I want to register or log in with Google, so that I don't have to remember another password.
- **US-14** As Ratna, when I register, I want to enter my children's gender and birthdate, so that I receive birthday emails for them later.
- **US-15** As Ratna, I want to verify my email before my account is fully active, so that my registration is secure.
- **US-16** As any user, I want to update my profile (including changing my email with re-verification), so that my information stays current.
- **US-17** As Ratna, if I'm a high-school student myself, I want to be able to set "0 children," so that the form doesn't force me to enter fake data.

### 2.4 Engagement Actions

- **US-18** As Ratna, I want to favorite an institution after I've logged in, so that I can find it again later.
- **US-19** As Ratna, I do NOT want to see how many other people favorited an institution, so that my decision isn't influenced by social proof on this site.
- **US-20** As Ratna, I want to send an inquiry to an institution through the site, with the institution's reply going to my own inbox, so that I can have a private conversation with them.
- **US-21** As Ratna, I want to be prevented from accidentally spamming an institution if I click submit twice, so that I don't embarrass myself.
- **US-22** As Doni, I want to give a star rating to an institution I've experienced, so that I can contribute to score quality, even though my rating isn't shown publicly.
- **US-23** As Doni, I want my rating to be final (no re-rating), so that I have to think carefully before submitting.

### 2.5 Birthday Emails

- **US-24** As Ratna, I want to receive a celebratory email on my own birthday and on each of my children's birthdays, so that I feel a personal connection to the site.
- **US-25** As Ratna, I want birthday emails to be email-only (no in-app notification spam), so that the experience stays low-friction.

### 2.6 Admin / Operations

- **US-26** As Ibu Sari, I want to upload an Excel file containing thousands of facility rows and see exactly what will change before I commit, so that I can catch errors before they go live.
- **US-27** As Ibu Sari, I want the importer to show me an error CSV listing every bad row with a clear reason, so that I can fix the spreadsheet and re-upload.
- **US-28** As Ibu Sari, I want to download the current facility data in the same Excel format, so that the next annual refresh starts from a clean baseline.
- **US-29** As Ibu Sari, I want to mark a row as `status=removed` in the spreadsheet, so that it's soft-deleted and the public URL returns 410.
- **US-30** As Ibu Sari, I want a unified inquiry inbox where new-listing requests, correction requests, and deletion requests all flow in with a Type tag, so that I can process them in one place.
- **US-31** As Ibu Sari, I want to set inquiry status (Unprocessed / In Progress / Done / Rejected), so that I can track my work.
- **US-32** As the super-admin, I want to add a new Kursus category, so that I can keep the taxonomy current.
- **US-33** As the super-admin, I want to be prevented from deleting a Kursus category that's currently in use by any facility, so that I don't break URLs or orphan data.
- **US-34** As the super-admin, I want to delete a fraudulent or BOT review, so that the score remains accurate; the site should automatically recompute the score when I do.

### 2.7 Public Forms (Kursus owners)

- **US-35** As Pak Budi, I want a public "Submit my facility" form, so that I can request my kursus be added.
- **US-36** As Pak Budi, I want a public "Request information correction" form on every detail page, so that I can fix errors about my facility.
- **US-37** As Pak Budi, I want a public "Request removal" form, so that I can opt my facility out of the directory.

---

## 3. Acceptance Criteria

Each Given/When/Then below maps to one or more user stories.

### 3.1 SEO and indexing

**AC-01 (US-01, US-04, US-05) — Server-rendered HTML on list and detail pages**
- **Given** a search-engine bot disabling JavaScript visits any list or detail URL,
- **When** the page is fetched,
- **Then** the response HTML contains a unique `<title>`, `<meta name="description">`, JSON-LD with the correct `@type`, and a `BreadcrumbList` JSON-LD block, with no client-side data fetch required to populate them.

**AC-02 (US-04) — Pagination**
- **Given** a list page has 51 or more matching facilities,
- **When** the user scrolls past page 1,
- **Then** a `/page/2` link is present in the HTML, the page loads with the next 50 facilities, and the canonical tag self-references `/page/2`.

**AC-03 — Removed facility returns 410**
- **Given** a facility has `status = removed`,
- **When** any visitor requests its detail URL,
- **Then** the server returns HTTP 410, the URL is excluded from `sitemap.xml`, and the facility does not appear in any list query.

**AC-04 — Search results are not indexed**
- **Given** a visitor lands on `/sekolah/search?q=...`,
- **When** the page renders,
- **Then** it includes `<meta name="robots" content="noindex">`, the URL is absent from `sitemap.xml`, and the canonical tag self-references the search URL.

### 3.2 List pages

**AC-05 (US-06) — Card content is restricted**
- **Given** any list page (any category, any region),
- **When** rendered,
- **Then** each card shows only the facility name, kabupaten/kota name, and one image (or default image if none); score, favorite count, inquiry count, review count, average stars, school_type chip, and category chip are not present.

**AC-06 — Sort order is internal**
- **Given** a Sekolah list page is rendered,
- **When** results are returned,
- **Then** they are sorted descending by `score`, ties broken alphabetically by name, with no sort UI offered to the user.

**AC-07 (US-29) — Timedoor pinned-top in Kursus**
- **Given** a Kursus list page is rendered,
- **When** results include facilities with `is_timedoor_academy = true`,
- **Then** all such facilities appear before any non-Timedoor facilities in the HTML, internally sorted by score then name; non-Timedoor facilities follow in standard sort order.

### 3.3 Detail pages

**AC-08 (US-07) — Empty fields hidden**
- **Given** a Sekolah detail page where `accreditation` is NULL and `curriculum` is empty,
- **When** the page renders,
- **Then** neither field is present in the rendered HTML; if all attribute fields in a section are empty, the section header is also omitted.

**AC-09 (US-08) — Map conditional**
- **Given** a facility has both `latitude` and `longitude`,
- **When** the detail page renders,
- **Then** a Google Maps iframe centered on the coordinates is shown; otherwise no map element is in the HTML.

**AC-10 (US-10) — Inquiry form gating**
- **Given** a facility has no `email`,
- **When** the detail page renders,
- **Then** the inquiry form is not present.

### 3.4 Authentication

**AC-11 (US-12, US-15) — Email verification gate**
- **Given** a user has registered but not yet clicked the verification email link,
- **When** they attempt to log in,
- **Then** login is denied with a "please verify your email" message and a "resend verification" button.

**AC-12 (US-13) — Google OAuth identity binding**
- **Given** an existing user with email `ratna@example.com` registered via password,
- **When** that same email signs in via Google for the first time,
- **Then** the existing user record is bound to the Google ID, the user is logged in, and no duplicate account is created.

**AC-13 (US-17) — Zero children allowed**
- **Given** a registering user enters "Number of children: 0",
- **When** they submit the form,
- **Then** registration succeeds with no children records and no birthday emails are scheduled for children.

### 3.5 Favorites, Inquiries, Reviews

**AC-14 (US-18, US-19) — Favorite cumulative**
- **Given** Ratna has previously favorited Facility X,
- **When** she clicks Favorite again on the same facility,
- **Then** the click is a no-op (idempotent), no duplicate row is inserted, no count is shown, and the score is not double-counted.

**AC-15 (US-20, US-21) — Inquiry rate limit**
- **Given** Ratna sent an inquiry to Facility X 30 minutes ago,
- **When** she submits another inquiry to Facility X,
- **Then** the request returns 429 with a clear message ("You've already contacted this facility recently — please wait an hour"), no email is sent, and `inquiries_count` is not incremented.

**AC-16 (US-20) — Inquiry email composition**
- **Given** Ratna submits an inquiry,
- **When** the email is dispatched,
- **Then** `From` is the system address, `Reply-To` is Ratna's email, the body contains her subject and message followed by the Timedoor Academy partnership footer, and a `mail_logs` row records the delivery status.

**AC-17 (US-22, US-23) — Review constraints**
- **Given** Doni rated Facility Y three stars yesterday,
- **When** he submits a new five-star rating for Facility Y,
- **Then** the request fails with "You have already rated this facility," `reviews` table is unchanged, `score` is unchanged.

**AC-18 — Review score addition rules**
- **Given** Doni submits a fresh ★4 rating for Facility Z whose score inputs are `inquiries_count=10, favorites_count=4, review_score_total=5`,
- **When** the review is saved,
- **Then** `review_score_total = 7` (5 + 2), `review_count` increments by 1, `score = 10*3 + 4 + 7 = 41`.

### 3.6 Birthday emails

**AC-19 (US-24, US-25) — Birthday batch idempotency**
- **Given** today is Ratna's birthday and the batch has already run once today,
- **When** the scheduler retries the job,
- **Then** the second run sends no email, no duplicate `birthday_mail_logs` row is created, and the run completes silently.

### 3.7 Admin imports

**AC-20 (US-26, US-27) — Validate-then-commit**
- **Given** Ibu Sari uploads a workbook with 1,000 rows where 12 rows have invalid `provinsi_slug`,
- **When** she clicks "Validate,"
- **Then** the preview shows "988 New/Updated, 12 Errors," she can download an annotated CSV listing the 12 bad rows, and the Commit button is disabled until either she fixes and re-uploads OR explicitly opts to "skip errors and commit valid rows."

**AC-21 (US-29) — Soft delete via status column**
- **Given** the import contains a row matching an existing facility with `status=removed`,
- **When** Ibu Sari commits,
- **Then** the existing facility is updated to `status=removed`, the public detail URL begins returning 410, sitemap regeneration excludes it, and the facility's row is no longer returned in any list query.

**AC-22 (US-28) — Round-trip refresh export**
- **Given** Ibu Sari clicks "Download current data" in Filament,
- **When** the export completes,
- **Then** she receives an XLSX file using the same template structure (same sheets, same columns) populated with current facility data and slugs, suitable for re-upload as the next annual refresh's starting point.

### 3.8 Admin moderation

**AC-23 (US-33) — Category deletion guard**
- **Given** the kursus category "coding" is set as `main_kursus_category_id` on 17 facilities,
- **When** the super-admin attempts to disable or delete the category,
- **Then** the action is blocked with "17 facilities are using this category as their main category. Please reassign them first," and no change is made.

**AC-24 (US-34) — Review deletion recalculation**
- **Given** an admin deletes a fraudulent ★5 review on Facility W,
- **When** the deletion completes,
- **Then** `review_count` decrements by 1, `review_score_total` decreases by 3, `score` is recalculated from the new totals, and the detail page cache is invalidated.

---

## 4. UX Flow Descriptions

### 4.1 First-visit organic-search flow (Ratna)

1. **Search engine result.** Ratna Googles *"sekolah swasta di kuta utara badung"* and clicks a Belajarpedia result.
2. **Lands on a list page** like `/sekolah/bali/kab-badung/kuta-utara/swasta/`. Above the fold she sees a heading "Sekolah Swasta di Kuta Utara, Kab. Badung, Bali," a breadcrumb trail, and a 50-card grid (each card: image, name, "Kab. Badung").
3. **Refines by clicking** a school card. The detail page loads in under 3 seconds and shows: hero image + name, breadcrumbs, address with Google Maps, phone, website link (each only if present), then conditional sections for accreditation, curriculum, biaya, jam_sekolah, fasilitas. A "Send Inquiry" button is below the contact block.
4. **Decides to favorite** for later. The favorite button prompts her to log in. She picks "Sign in with Google," gets bounced to Google, returns logged in, and the favorite is saved silently (no count, no toast counter).
5. **Sends an inquiry.** She types a subject and message; submits. Toast: "Your message has been sent to {school name}." The school replies directly to her email.
6. **Returns later** by typing the URL or following her bookmark. Same fast load, no re-auth needed (Sanctum cookie still valid).

### 4.2 Annual data-refresh flow (Ibu Sari)

1. **Login to admin** at `api.belajarpedia.com/admin`. Filament dashboard shows tile counts: Facilities, Inquiries (Unprocessed), Reviews this week.
2. **Navigates to "Data Import."** Clicks "Download Current Data," receives `belajarpedia_facility_export_2027-04-15.xlsx`.
3. **Opens the file** in Excel locally. The README sheet reminds her of the rules (slugs are immutable, status=removed soft-deletes, etc.). She updates the `sekolah` sheet with new tuition figures across 200 schools and adds 30 new rows.
4. **Returns to Filament**, uploads the modified file. Validation runs server-side over ~2 minutes; she sees a progress bar.
5. **Preview report:** "Total rows: 5,230. New: 30. Updated: 200. Errors: 4." She clicks the error count to expand: 4 rows had invalid `kecamatan_slug`. She downloads the annotated error CSV, fixes the 4 typos in Excel, re-uploads.
6. **Preview report (round 2):** "New: 30. Updated: 200. Errors: 0." She clicks Commit. A queued job runs; she sees "Import in progress…" with an estimated time. On completion, a notification banner: "Import complete. Cache invalidated for 230 facility detail pages."
7. **Spot-checks** by visiting one of the updated public URLs. The new tuition is live.

### 4.3 Inquiry-inbox triage flow (Ibu Sari)

1. **Filament dashboard** shows 14 unprocessed inquiries.
2. **Navigates to "Inquiries"** list. Filters by Type = "Deletion Request."
3. **Opens an entry** from Pak Budi requesting his facility be removed. She sees facility name, URL, requester email, message, IP/timestamp.
4. **Clicks the facility URL** in the inquiry detail; opens the Filament Facility editor in a new tab. She marks `status = removed` and saves. The public URL begins returning 410.
5. **Returns to the inquiry**, sets status to "Done," types a brief internal note. She optionally hits "Reply via email" which composes a draft in her email client (mailto:) thanking Pak Budi and confirming the removal.

### 4.4 Review submission flow (Doni)

1. **Logged in.** On a Universitas detail page he sees a star input under "Rating." Hover-state shows ★1–★5.
2. **Clicks ★4.** A confirmation modal appears: "You can only rate this facility once and cannot change it later. Submit?"
3. **Confirms.** API call posts the review; on response the star UI replaces itself with "You rated this 4 stars" — no average, no count, no other ratings.
4. **No email** is sent; site remains static for him from his perspective.

### 4.5 Home Rekomendasi flow (any visitor)

1. **Lands on `belajarpedia.com`.** Top: hero + fixed SEO description text. Below: three sections.
2. **Sekolah section** shows region selector (provinsi → kabkota dropdowns); below that, a row of 8 randomly sampled Sekolah cards (filtered to score ≥ 10, status = active). On every page reload, the 8 cards reshuffle (client-side fetch, cache-bypassed).
3. **Universitas section** mirrors Sekolah.
4. **Kursus section** shows category chip nav (all active kursus categories); below, 8 cards composed of 2 random Timedoor facilities (always present) followed by 6 random general facilities.
5. **Search bar** above all sections requires picking a category before submitting.

---

## 5. Edge Cases

### 5.1 Public site
- **Zero-result list page.** Renders heading + "No facilities found" message + back-to-parent breadcrumb; `<meta name="robots" content="noindex">`; not in sitemap; still cacheable for 60 minutes.
- **Region with all facilities removed.** Same as zero-result; no special treatment.
- **Facility with no images.** Card and detail page render the default placeholder image.
- **Facility with no map coordinates.** Map block omitted; address text remains visible if present.
- **Facility with absolutely no contact details.** Detail page renders name + breadcrumb + description (if any) + a "Report missing information" link; inquiry form absent.
- **Slug collision in URL.** Slugs are guaranteed unique per category by `-2/-3` suffixing; no collision can reach the public URL.
- **Two facilities with same name + different addresses.** Different `(name, address)` → treated as separate facilities; slug suffix disambiguates URL.
- **URL with valid path but trailing junk** (e.g., `/sekolah/bali/?utm=...`). Query params are stripped from canonicalization; cache key uses path only.
- **Pagination beyond last page** (e.g., `/page/99` on a 60-result list). Returns 404.
- **Pagination on zero-result list.** `/page/2` returns 404 because total is < 51.

### 5.2 Authentication & user actions
- **User registers with already-used email.** Form returns "This email is already registered. Sign in instead?"
- **User clicks expired verification link.** Shows "This link has expired" with a "Resend verification" button.
- **User attempts login during email-verification window.** Login refused; reminder shown.
- **Google OAuth email mismatch with existing account.** If a Google-OAuth login presents a verified email matching an existing password account, accounts are merged (Google ID added to the existing record). If the email is NOT verified by Google (rare), reject.
- **User changes email to one already used by another account.** Form returns "This email is already in use" before sending the verification email.
- **Concurrent favorite click (double-tap).** Second request hits UNIQUE constraint → API returns 200 with "already favorited" semantics; UI shows favorited state.
- **Inquiry form submit while logged out (session expired mid-form).** Server returns 401; client redirects to login preserving the typed message in URL state.
- **Inquiry submit when facility's email field has just been removed by an admin.** Server returns 422 "This facility no longer accepts inquiries"; form hidden on next page render.
- **Review submit on a facility that's just been soft-deleted.** Server returns 410; client shows "This facility is no longer listed."
- **User deletes their account.** All favorites, reviews, inquiries, children, birthday logs are hard-deleted after a 14-day grace period. Score recalculated for affected facilities.

### 5.3 Admin & import
- **Excel upload with mixed valid/invalid rows.** Validation report enumerates errors; admin chooses commit-valid-only or fix-and-retry.
- **Excel upload that conflicts with manual edits made since the last export.** Importer always operates on current DB state; admin's manual edit will be overwritten by an import row that matches `(name, address)`. Operator runbook warns about this.
- **Excel row with `is_timedoor_academy=TRUE` on a non-kursus row.** Validation error: "is_timedoor_academy may only be TRUE on kursus rows."
- **Excel row marked `status=removed` for a facility that has reviews/favorites.** Soft-delete proceeds; reviews and favorites remain in DB but no longer count toward live score updates (the facility is excluded from public queries; its `score` is frozen).
- **Two import rows with identical `(name, address)`.** Importer rejects the entire upload with "Duplicate keys within import file"; admin must dedupe in Excel.
- **Import committed while another import is running.** Filament prevents concurrent commits via Redis lock; second admin sees "Another import is in progress."
- **Kursus category disabled while a facility's main_category points to it.** Blocked at validation; admin must reassign first.
- **Admin deletes a review while another admin is reading the affected facility.** Both operations succeed; the second admin's view is stale until refresh; nothing breaks because score is recomputed atomically.

### 5.4 Email & batches
- **Birthday batch on Feb 29 in non-leap year.** Users with birthdate Feb 29 receive their birthday email on Feb 28 (documented behavior).
- **Birthday batch fails midway.** Job retries; idempotency via `UNIQUE(user_id, sent_at_date)` prevents duplicate sends.
- **SendGrid API outage during inquiry submit.** Mail dispatch fails; queued job retries with exponential backoff up to 5 attempts; final failure logged to `mail_logs` and a Slack alert (or email to ops) fires. User sees "Your message will be delivered shortly."
- **Facility email bounces hard 3 times.** Auto-set `email_disabled_at`; inquiry form hidden on detail page until admin re-validates.

### 5.5 Caching & invalidation
- **Score change but Next.js revalidate webhook fails.** Webhook is retried up to 3 times; after that, the next natural ISR boundary (within 60 minutes) refreshes the page. Stale-window is bounded at 60 minutes by design.
- **Cloudflare R2 image upload succeeds but DB update fails.** Orphaned object in R2; nightly cleanup job deletes objects not referenced by any facility.
- **Cache key collision between provinsi names.** Provinsi slugs are unique; impossible.

### 5.6 Edge data conditions
- **Facility with 50+ sub categories.** Allowed by schema; UI renders categories as a wrapping chip list. No business limit imposed.
- **Score reaches very high values (e.g., 100,000+).** No overflow; column is BIGINT.
- **User has 20+ children.** No artificial cap; children list scrolls in profile editor; birthday batch handles them all.
- **Review deleted on a facility with `review_count=1`.** Counts go to zero; `review_score_total=0`; score recalculated to base. Detail page no longer offers any rating context.
- **Slug collision at the 99th retry.** Suffix continues to increment; no upper bound. Realistically capped by name uniqueness in practice.
