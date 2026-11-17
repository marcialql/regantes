import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  test: {
    globalSetup: ['./tests/helpers/global-setup.ts'],
    include: ['tests/**/*.test.ts'],
    // All test files share one database that is truncated per test.
    fileParallelism: false,
    testTimeout: 20_000,
  },
});
