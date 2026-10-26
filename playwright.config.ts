import { defineConfig, devices } from '@playwright/test';

const CI = !!process.env.CI;
const WEB_URL = 'http://localhost:5173';

export default defineConfig({
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? 'github' : 'list',
  use: {
    ...devices['Desktop Chrome'],
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'e2e', testDir: './tests/e2e', use: { baseURL: WEB_URL } }],
  webServer: { command: 'npm run dev', url: WEB_URL, reuseExistingServer: !CI, timeout: 120_000 },
});
