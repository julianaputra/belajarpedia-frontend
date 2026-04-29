/**
 * Belajarpedia maintenance worker.
 *
 * Activate by binding this Worker to a route covering belajarpedia.com/* in
 * Cloudflare Dashboard. While bound, ALL incoming traffic gets the friendly
 * 503 page below. Unbind to restore normal traffic.
 *
 * Allowed bypass: requests with header `X-Maintenance-Bypass: <secret>` are
 * forwarded to the origin. Use for ops smoke tests during the window.
 *
 * Deploy via wrangler:
 *   cd infra/cloudflare
 *   wrangler deploy maintenance-worker.js --name belajarpedia-maintenance
 *
 * OR copy-paste contents into the Cloudflare Dashboard → Workers & Pages.
 */

const BYPASS_HEADER = "X-Maintenance-Bypass";

const maintenanceWorker = {
  async fetch(request, env) {
    // Bypass for ops if secret matches
    const provided = request.headers.get(BYPASS_HEADER);
    if (provided && env.MAINTENANCE_BYPASS_SECRET && provided === env.MAINTENANCE_BYPASS_SECRET) {
      return fetch(request);
    }

    return new Response(MAINTENANCE_HTML, {
      status: 503,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, no-cache, must-revalidate",
        "retry-after": "300",
      },
    });
  },
};

export default maintenanceWorker;

const MAINTENANCE_HTML = /* html */ `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Belajarpedia — Sedang Dirawat</title>
<style>
  :root {
    --brand: #10AF13;
    --ink: #1C2F70;
    --body: #212529;
    --muted: #6c757d;
    --bg: #ffffff;
    --bg-soft: #f8fafb;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: var(--bg);
    background-image:
      linear-gradient(to right, rgb(28 47 112 / 0.04) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(28 47 112 / 0.04) 1px, transparent 1px);
    background-size: 24px 24px;
    color: var(--body);
    font-family: -apple-system, BlinkMacSystemFont, "Poppins", system-ui, sans-serif;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }
  main {
    max-width: 32rem;
    text-align: center;
    background: white;
    border: 2px solid #d9deef;
    border-radius: 1.25rem;
    padding: 2rem 1.5rem;
    box-shadow: 0 10px 25px -10px rgb(28 47 112 / 0.25);
  }
  .logo {
    display: inline-block;
    font-weight: 800;
    font-size: 1.25rem;
    color: var(--ink);
    margin-bottom: 1.5rem;
  }
  .logo span { color: var(--brand); }
  .emoji { font-size: 3rem; margin-bottom: 1rem; line-height: 1; }
  h1 {
    color: var(--ink);
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
    font-weight: 800;
  }
  p { color: var(--muted); line-height: 1.6; margin: 0.5rem 0; }
  .pill {
    display: inline-block;
    background: #ecfdee;
    color: #0a7510;
    border: 2px solid #a7f3b3;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 1rem;
  }
</style>
</head>
<body>
  <main>
    <div class="logo">Belajar<span>pedia</span></div>
    <div class="emoji" aria-hidden="true">🛠️</div>
    <h1>Sedang dalam perawatan</h1>
    <p>
      Kami sedang melakukan pembaruan sistem untuk pengalaman yang lebih baik.
      Akan kembali sebentar lagi.
    </p>
    <p>Terima kasih atas kesabaranmu.</p>
    <div class="pill">Estimasi: kurang dari 5 menit</div>
  </main>
</body>
</html>`;
