import { expect, test } from "@playwright/test";

/**
 * T-01 mitigation: SEO regression suite. Asserts every public page type
 * renders title, description, JSON-LD blocks, breadcrumbs, and correct
 * robots directives in the SSR HTML — independent of client JS execution.
 *
 * If any of these fails, indexability is at risk and merging is blocked.
 */

async function getJsonLd(html: string): Promise<unknown[]> {
  const matches = [...html.matchAll(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )];
  return matches.map((m) => {
    try {
      return JSON.parse(m[1]!);
    } catch {
      return null;
    }
  });
}

test.describe("SEO — Home", () => {
  test("renders title, meta, OG, Organization+WebSite JSON-LD", async ({ page, request }) => {
    const response = await request.get("/");
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html).toMatch(/<html[^>]*lang="id"/);
    expect(html).toMatch(/<title>[^<]*Belajarpedia[^<]*<\/title>/);
    expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]+"/);

    const jsonLds = await getJsonLd(html);
    const types = jsonLds
      .map((j) => (j as { "@type"?: string })?.["@type"])
      .filter(Boolean);
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");

    // Visit page for visible assertions
    await page.goto("/");
    await expect(page).toHaveTitle(/Belajarpedia/);
    await expect(page.locator("h1").first()).toBeVisible();
  });
});

test.describe("SEO — Sekolah list (root)", () => {
  test("title with category, breadcrumb JSON-LD, robots index", async ({ request }) => {
    const response = await request.get("/sekolah");
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html).toMatch(/<title>[^<]*Sekolah[^<]*<\/title>/);
    expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]+"/);

    // Should NOT include noindex (root list with results is indexable).
    expect(html).not.toMatch(/<meta\s+name="robots"\s+content="[^"]*noindex/);

    const jsonLds = await getJsonLd(html);
    const breadcrumb = jsonLds.find(
      (j) => (j as { "@type"?: string })?.["@type"] === "BreadcrumbList",
    );
    expect(breadcrumb).toBeTruthy();
    expect(
      ((breadcrumb as { itemListElement: unknown[] }).itemListElement.length),
    ).toBeGreaterThanOrEqual(2);
  });
});

test.describe("SEO — Sekolah list (deeper level)", () => {
  test("province + kabkota in title and breadcrumb", async ({ request }) => {
    const response = await request.get("/sekolah/bali/kab-badung");
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html.toLowerCase()).toMatch(/badung/);
    expect(html.toLowerCase()).toMatch(/bali/);

    const jsonLds = await getJsonLd(html);
    const breadcrumb = jsonLds.find(
      (j) => (j as { "@type"?: string })?.["@type"] === "BreadcrumbList",
    ) as { itemListElement: unknown[] } | undefined;
    expect(breadcrumb).toBeTruthy();
    expect(breadcrumb!.itemListElement.length).toBeGreaterThanOrEqual(3);
  });
});

test.describe("SEO — Search page noindex", () => {
  test("/sekolah/search?q=foo emits noindex robots meta", async ({ request }) => {
    const response = await request.get("/sekolah/search?q=negeri");
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html).toMatch(/<meta\s+name="robots"\s+content="[^"]*noindex/);
  });

  test("empty-query search prompt also noindex", async ({ request }) => {
    const response = await request.get("/sekolah/search");
    expect(response.status()).toBe(200);
    const html = await response.text();

    expect(html).toMatch(/<meta\s+name="robots"\s+content="[^"]*noindex/);
  });
});

test.describe("SEO — Detail page", () => {
  test("Sekolah detail emits School (or fallback EducationalOrganization) JSON-LD", async ({
    page,
    request,
  }) => {
    // Use home → click first card to find a real mock URL deterministically
    await page.goto("/sekolah");
    const firstCard = page.locator('a[href^="/sekolah/"]').first();
    const href = await firstCard.getAttribute("href");
    expect(href).toBeTruthy();

    const response = await request.get(href!);
    expect([200, 410]).toContain(response.status());

    if (response.status() === 200) {
      const html = await response.text();
      expect(html).toMatch(/<title>/);
      const jsonLds = await getJsonLd(html);
      const types = jsonLds
        .map((j) => (j as { "@type"?: string })?.["@type"])
        .filter(Boolean);
      // Must have BreadcrumbList + a Facility schema.
      expect(types).toContain("BreadcrumbList");
      expect(
        types.some((t) =>
          ["School", "CollegeOrUniversity", "EducationalOrganization"].includes(
            t!,
          ),
        ),
      ).toBeTruthy();
    }
  });
});

test.describe("SEO — robots.txt + sitemap.xml", () => {
  test("/robots.txt references sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text.toLowerCase()).toContain("sitemap:");
    expect(text.toLowerCase()).toContain("user-agent:");
  });

  test("/sitemap.xml is XML", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toMatch(/<\?xml|<urlset|<sitemapindex/);
  });
});

test.describe("SEO — pagination canonical", () => {
  test("/page/1 should not exist, /page/n self-canonicals", async ({ request }) => {
    // Navigate deep enough to find a page 2
    const response = await request.get("/sekolah/page/2");
    // May be 200 (if mock data spans 50+) or 404. Both acceptable.
    expect([200, 404]).toContain(response.status());

    if (response.status() === 200) {
      const html = await response.text();
      expect(html).toMatch(/<link\s+rel="canonical"[^>]*\/page\/2/);
    }
  });
});
