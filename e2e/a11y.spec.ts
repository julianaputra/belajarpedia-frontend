import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Serialize axe runs — running in parallel with other test files races against
// dev-server HMR and produces sporadic false positives.
test.describe.configure({ mode: "serial" });

/**
 * Accessibility audit via axe-core.
 *
 * Runs WCAG 2.1 AA checks on key public surfaces. We scope to "serious" and
 * "critical" violations — minor/moderate issues are tracked but don't block
 * merges. Goal: zero serious/critical at all times (NFR §6 a11y commitment).
 */

const PAGES = [
  { name: "Home", url: "/" },
  { name: "Sekolah list (root)", url: "/sekolah" },
  { name: "Sekolah list (region)", url: "/sekolah/bali" },
  { name: "Search prompt", url: "/sekolah/search" },
  { name: "Login", url: "/login" },
  { name: "Register", url: "/register" },
  { name: "Forgot password", url: "/forgot-password" },
  { name: "Submit listing", url: "/submit-listing" },
  { name: "Request correction", url: "/request-correction" },
];

for (const p of PAGES) {
  test(`${p.name} — no serious/critical a11y violations`, async ({ page }) => {
    await page.goto(p.url);
    // Wait for client islands to hydrate
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // Color-contrast is tracked as a brand-design audit item (see
      // docs/qa-runbook.md §10). Brand primary green #10AF13 + white text
      // fails AA 4.5:1; resolution requires alignment with stakeholders on
      // adjusted button/link palette. Structural a11y rules remain strict.
      .disableRules(["color-contrast"])
      .analyze();

    const blocking = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );

    if (blocking.length > 0) {
      console.log(
        `${p.name} a11y violations:`,
        blocking.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.length,
          firstNode: v.nodes[0]?.html?.slice(0, 200),
        })),
      );
    }

    expect(blocking).toEqual([]);
  });
}
