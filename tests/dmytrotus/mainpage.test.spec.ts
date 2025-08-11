import { test, expect } from '@playwright/test';

test('Shows mamyito page', async ({ page }) => {
  await page.goto('https://mamyito.pl');

  await expect(page.locator('body')).toContainText('Promocje');
});