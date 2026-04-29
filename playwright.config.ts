import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

/**
 * Playwright config — runs against a local Next.js dev/build with mock API
 * enabled. Two projects exercise desktop + mobile rendering paths.
 *
 * Run:
 *   npm run test:e2e          # headless, both projects
 *   npm run test:e2e:ui       # interactive UI mode
 *   npm run test:e2e:headed   # see browsers
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  // Limit workers — running many parallel requests against `next dev` triggers
  // HMR/compile races. CI uses prod build via `start`, so 2 is fine there.
  workers: process.env.CI ? 2 : 2,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },

  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_USE_MOCK_API: "true",
      NEXT_PUBLIC_SITE_URL: baseURL,
      NEXT_PUBLIC_API_BASE_URL: "http://localhost:8000",
      REVALIDATE_SECRET: "test-secret-12345",
    },
  },
});
