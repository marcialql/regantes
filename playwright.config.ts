import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3100' },
  webServer: {
    command: 'pnpm exec tsx scripts/e2e-server.ts',
    url: 'http://localhost:3100/login',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
