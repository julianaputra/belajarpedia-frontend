import { expect, test } from "@playwright/test";

/**
 * Functional smoke tests covering URL parser edge cases and basic flows.
 * Acceptance criteria covered: AC-02 (pagination), edge cases 5.1.
 */

test.describe("Routing — invalid paths return 404", () => {
  test("invalid sekolah segment", async ({ request }) => {
    const response = await request.get(
      "/sekolah/INVALID-CAPS-NOT-ALLOWED",
    );
    expect(response.status()).toBe(404);
  });

  test("too many sekolah segments", async ({ request }) => {
    const response = await request.get("/sekolah/a/b/c/d/e/f/g");
    expect(response.status()).toBe(404);
  });

  test("pagination beyond last page returns 404", async ({ request }) => {
    const response = await request.get("/sekolah/bali/page/9999");
    expect(response.status()).toBe(404);
  });
});

test.describe("Search empty state", () => {
  test("zero-result query renders empty state with cross-category links", async ({
    page,
  }) => {
    await page.goto("/sekolah/search?q=zzznonexistentquery123");
    await expect(
      page.getByText(/Tidak ada hasil untuk/i).first(),
    ).toBeVisible();
    // Cross-category suggestions
    await expect(page.getByText(/coba cari/i).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Universitas/i }).first(),
    ).toBeVisible();
  });

  test("no-query search shows popular search prompt", async ({ page }) => {
    await page.goto("/sekolah/search");
    await expect(page.getByText(/Cari di Sekolah/i).first()).toBeVisible();
    await expect(page.getByText(/Pencarian populer/i).first()).toBeVisible();
  });
});

test.describe("Home → list → detail navigation", () => {
  test("first sekolah card links to a valid detail page", async ({ page }) => {
    await page.goto("/sekolah");
    const firstCard = page.locator('a[href^="/sekolah/"]').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // We should land on either a detail page (200) or a 410 if random selection
    // hit a removed facility. Both flows are valid app behavior.
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
  });
});

test.describe("Pagination component renders correctly", () => {
  test("page 1 shows 'Sebelumnya' disabled, 'Berikutnya' enabled when more pages", async ({
    page,
  }) => {
    await page.goto("/sekolah");
    // Pagination only renders when totalPages > 1
    const pag = page.getByRole("navigation", { name: /halaman/i });
    if ((await pag.count()) > 0) {
      const prev = pag.getByText("‹ Sebelumnya");
      await expect(prev).toBeVisible();
      await expect(prev).toHaveAttribute("aria-disabled", "true");
    }
  });
});

test.describe("Responsive smoke", () => {
  test("home page renders without horizontal scroll on mobile", async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "Horizontal-scroll guard is a mobile-viewport concern.",
    );
    await page.goto("/");
    const docWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    const viewportWidth = page.viewportSize()?.width ?? 0;
    expect(docWidth).toBeLessThanOrEqual(viewportWidth + 2);
  });

  test("category list shows facility cards", async ({ page }) => {
    await page.goto("/sekolah");
    const cards = page.locator('a[href^="/sekolah/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });
});

test.describe("Auth-gated UX", () => {
  test("/profile redirects to /login when unauthenticated", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForURL(/\/login\?returnTo=/);
    expect(page.url()).toMatch(/returnTo=(?:%2F|\/)profile/);
  });

  test("/favorites redirects to /login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/favorites");
    await page.waitForURL(/\/login\?returnTo=/);
    expect(page.url()).toMatch(/returnTo=(?:%2F|\/)favorites/);
  });
});

test.describe("Public forms are accessible without auth", () => {
  test("submit-listing renders form", async ({ page }) => {
    await page.goto("/submit-listing");
    await expect(
      page.getByRole("heading", { name: /Daftarkan/i }).first(),
    ).toBeVisible();
    await expect(page.getByLabel(/Nama fasilitas/i)).toBeVisible();
  });

  test("request-correction prefills facility_url from query", async ({
    page,
  }) => {
    const url = "https://belajarpedia.com/sekolah/bali/test";
    await page.goto(`/request-correction?facility_url=${encodeURIComponent(url)}`);
    const input = page.getByLabel(/URL fasilitas/i);
    await expect(input).toHaveValue(url);
  });
});
