# Operator Runbook — Belajarpedia Frontend

**Audience:** On-call engineer / DevOps / Timedoor operations.
**Purpose:** Routine deploy + incident response procedures for the Next.js
public site running on AWS shared host behind Cloudflare.

---

## 1. Architecture One-Pager

```
[ User ]
   │
   ▼
[ Cloudflare ] ── DNS, TLS, WAF, Turnstile, asset CDN
   │
   ▼
[ AWS host (EC2/Lightsail) ]
   ├─ Nginx :443 (TLS termination)
   │   ├─ /api/*, /sanctum/*, /admin → Laravel (PHP-FPM)
   │   └─ /*                        → Next.js Node (PM2 :3000)
   ├─ MySQL 8 (RDS or local)
   ├─ Redis 7
   └─ Node.js process (PM2: `belajarpedia-next`)
        ├─ Reads ENV from /var/www/belajarpedia/current/.env.production
        └─ Symlink: /var/www/belajarpedia/current → /releases/{sha}
```

## 2. Required Environment Variables (Production)

In `/var/www/belajarpedia/current/.env.production` on the host:

```bash
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://belajarpedia.com
NEXT_PUBLIC_API_BASE_URL=https://api.belajarpedia.com
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<from Cloudflare>
NEXT_PUBLIC_GMAPS_KEY=<from Google Cloud, referrer-locked to *.belajarpedia.com>
NEXT_PUBLIC_R2_PUBLIC_URL=https://images.belajarpedia.com
NEXT_PUBLIC_SENTRY_DSN=<from Sentry project settings>
NEXT_PUBLIC_SENTRY_ENV=production
REVALIDATE_SECRET=<≥32 random chars, identical on Laravel side>
```

CI-only (deploy workflow):
- `SENTRY_AUTH_TOKEN` (secret)
- `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` (secrets)
- `SENTRY_ORG`, `SENTRY_PROJECT`, `SITE_URL`, `API_BASE_URL`, `TURNSTILE_SITE_KEY`,
  `GMAPS_KEY`, `R2_PUBLIC_URL`, `SENTRY_DSN` (vars)

## 3. Deploy

### Standard release (tag-driven)

```bash
git tag v1.4.0
git push origin v1.4.0
```

GitHub Actions `Deploy` workflow auto-runs:
1. Install + build with prod env injection
2. Pack `.next/` + `public/` + `package*.json` + `next.config.ts` + `node_modules`
3. SSH/rsync tarball to `/tmp/` on host
4. Extract to `/var/www/belajarpedia/releases/{sha}/`
5. Atomic symlink swap → `/var/www/belajarpedia/current`
6. `pm2 reload belajarpedia-next --update-env` (zero-downtime)
7. Sentry release notify + commits + deploy event
8. Smoke test homepage 5× retry

Watch: GitHub Actions tab. Total ~6–8 min.

### Manual deploy via workflow_dispatch

GitHub → Actions → Deploy → Run workflow:
- ref: branch/tag (default = main)
- environment: staging | production

Use staging for hotfix preview before tagging.

### First-time setup on host

```bash
sudo mkdir -p /var/www/belajarpedia/releases
sudo chown deploy:deploy /var/www/belajarpedia
sudo -u deploy bash -c '
  cd /var/www/belajarpedia
  npm install -g pm2
  pm2 start "node node_modules/next/dist/bin/next start -p 3000" \
    --name belajarpedia-next \
    --cwd /var/www/belajarpedia/current
  pm2 save
  pm2 startup systemd  # then run the printed command as root
'
```

## 4. Rollback

The deploy keeps the last 5 releases under `/var/www/belajarpedia/releases/`.

```bash
ssh deploy@belajarpedia.com
cd /var/www/belajarpedia/releases
ls -lat                                  # find previous good SHA
ln -sfn /var/www/belajarpedia/releases/<good-sha> /var/www/belajarpedia/current.new
mv -Tf /var/www/belajarpedia/current.new /var/www/belajarpedia/current
pm2 reload belajarpedia-next --update-env
curl -sf https://belajarpedia.com >/dev/null && echo OK
```

Total time: ~30 seconds. No data loss; pure cache flip.

## 5. Cache Purge / Revalidation

For content that should appear immediately after a Laravel write:

### Per-page revalidation
```bash
curl -X POST https://belajarpedia.com/internal/revalidate \
  -H "Content-Type: application/json" \
  -H "X-Revalidate-Secret: $REVALIDATE_SECRET" \
  -d '{
    "paths": [
      "/sekolah/bali/kab-badung/kuta-utara/negeri/<slug>",
      "/sekolah/bali/kab-badung/kuta-utara/negeri",
      "/sekolah/bali/kab-badung/kuta-utara",
      "/sekolah/bali/kab-badung",
      "/sekolah/bali"
    ],
    "tags": ["facility:sekolah:<slug>", "facilities:sekolah"]
  }'
```

Response 200 lists what was invalidated. See `docs/revalidate-webhook.md` for
full event mapping.

### Sitemap-wide flush

```bash
curl -X POST https://belajarpedia.com/internal/revalidate \
  -H "X-Revalidate-Secret: $REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"paths":["/sitemap.xml","/sekolah/sitemap/0.xml","/universitas/sitemap/0.xml","/kursus/sitemap/0.xml"]}'
```

### Cloudflare CDN purge (if asset CDN got stale)

Cloudflare Dashboard → Caching → Configuration → Purge Everything (last resort).
Or per-URL: `Purge by URL`.

## 6. Maintenance Mode

When you need to take the site fully offline (DB migration, cutover, etc.):

```bash
cd infra/cloudflare
wrangler deploy maintenance-worker.js --name belajarpedia-maintenance
# Then in Cloudflare Dashboard → Workers Routes:
# Bind belajarpedia-maintenance to belajarpedia.com/*
```

To **bypass** the maintenance page during the window (smoke tests):

```bash
curl -H "X-Maintenance-Bypass: <secret>" https://belajarpedia.com
```

Set the secret first via `wrangler secret put MAINTENANCE_BYPASS_SECRET`.

To **deactivate**: remove the route binding in Cloudflare Dashboard. Traffic
flows back to the origin.

## 7. Incident Response

### 5xx spike

1. Check Sentry → Issues filtered by environment=production for last hour.
2. If new error introduced by recent deploy → ROLLBACK (§4) immediately.
3. If gradual / external (DB unreachable, Laravel down) → check Laravel side
   in `api.belajarpedia.com`.
4. If Cloudflare-side (502 Bad Gateway) → check origin Nginx + PM2.

```bash
ssh deploy@belajarpedia.com
pm2 list
pm2 logs belajarpedia-next --lines 100
sudo systemctl status nginx
```

### Slow page loads

1. Cloudflare Analytics → check cache hit rate and edge request volume.
2. `pm2 monit` on host — Node CPU/memory.
3. If ISR cache thrashing (every request a miss), check that
   `revalidate: 3600` is honored — deploy may have cleared `.next/cache`.
   Solution: warm a few high-traffic URLs.

### Deploy rolled back, site still broken

Likely cause: `node_modules` cached differently between releases.

```bash
ssh deploy@belajarpedia.com
cd /var/www/belajarpedia/current
rm -rf node_modules .next
npm ci --omit=dev
npm run build
pm2 reload belajarpedia-next --update-env
```

### Cache stuck (revalidation not working)

1. Verify `REVALIDATE_SECRET` matches on both sides.
2. Test webhook with curl (§5).
3. If still stuck: restart Node process — `pm2 reload belajarpedia-next`.
4. Last resort: full site rebuild — `npm run build && pm2 reload`.

### SSL / Certificate issues

Cloudflare manages TLS at edge. If errors:
- Cloudflare Dashboard → SSL/TLS → make sure mode is "Full (strict)"
- Origin cert valid (check `openssl s_client -connect belajarpedia.com:443`)

## 8. On-Call Playbook (First 15 minutes)

Triage steps in order:

1. **Acknowledge** the alert (Sentry/PagerDuty/email).
2. **Verify** via curl: `curl -I https://belajarpedia.com` — what's the status?
3. **Triage tab in Sentry**: latest error spike, affected URLs, browser/OS.
4. **Recent deploy?** GitHub Actions → last 24h. If yes and timeline matches
   issue → consider rollback.
5. **External dependency?** Check api.belajarpedia.com health, MySQL replica
   lag, Redis memory, R2 status, SendGrid event delivery.
6. **Communicate** in Timedoor #ops Slack: status + ETA.
7. **Mitigate** before fixing root cause — rollback, maintenance mode, or
   feature flag toggle.
8. **Postmortem** within 48h — what failed, why, prevention.

## 9. Quarterly Maintenance Tasks

- [ ] Rotate `REVALIDATE_SECRET` (frontend + Laravel envs simultaneously).
- [ ] Rotate `DEPLOY_SSH_KEY` in GitHub repo secrets.
- [ ] Renew Google Maps API key, verify referrer restriction `*.belajarpedia.com/*`.
- [ ] Test backup restore on staging from latest MySQL dump (T-09 mitigation).
- [ ] Check Cloudflare R2 image quotas; clean orphaned objects.
- [ ] Run `npm audit`; update deps with security advisories.
- [ ] Review Sentry quota usage; adjust `tracesSampleRate` if needed.

## 10. Useful Links

| Resource | URL |
|---|---|
| Production site | https://belajarpedia.com |
| API | https://api.belajarpedia.com |
| Admin (Filament) | https://api.belajarpedia.com/admin |
| Sentry (frontend) | https://<org>.sentry.io/projects/belajarpedia-frontend/ |
| GitHub repo | https://github.com/<org>/belajarpedia-frontend |
| Cloudflare zone | https://dash.cloudflare.com → belajarpedia.com |
| AWS console | https://console.aws.amazon.com → EC2/Lightsail (region) |
| Search Console | https://search.google.com/search-console → belajarpedia.com |

## 11. Reference Docs

- `docs/implementation_plan_frontend.md` — full architecture & decisions
- `docs/auth-config.md` — Sanctum cookie setup
- `docs/revalidate-webhook.md` — cache invalidation contract
- `docs/dev-mock-api.md` — mock layer (dev/test only)
- `docs/qa-runbook.md` — testing + Lighthouse procedure
- `belajarpedia_version01_*.md/.yaml` — original product spec
