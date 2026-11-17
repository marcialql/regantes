// Screenshots of every area at 375x812 and 1280x800 into .superpowers/capturas (not part of `pnpm test:e2e`).
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './scripts/capturas',
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
