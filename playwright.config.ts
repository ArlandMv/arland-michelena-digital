import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // CI: 2 workers para que los 4 proyectos (Chromium + WebKit) no dupliquen el tiempo del job.
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // #34: la suite completa también corre en móvil (Pixel 7 usa Chromium, sin navegadores extra en CI).
      name: 'movil',
      use: { ...devices['Pixel 7'] },
    },
    {
      // Ciclo 13: Safari de escritorio (motor WebKit).
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      // Ciclo 13: Safari en iPhone (WebKit móvil, viewport táctil de 390 px).
      name: 'movil-webkit',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
