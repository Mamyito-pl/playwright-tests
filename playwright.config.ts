import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 4 : undefined,

  reporter: [['html'], ['allure-playwright', {
    detail: true,
    outputFolder: "allure-results",
    suiteTitle: true,
    categories: [
      {
        name: "Outdated tests",
        messageRegex: ".*FileNotFound.*",
      },
    ],
    environmentInfo: {
      framework: "playwright",
    },
  }]],
  use: {
    baseURL: process.env.URL,
    trace: 'retain-on-failure',
    screenshot: "only-on-failure",
    video: "on",
  },

  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080}
       },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080}
       },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080}
       },
    },
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 5']
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        browserName: 'webkit',
        ...devices['iPhone 14']
      },
    },
  ]
});
