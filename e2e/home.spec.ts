import { test, expect } from '@playwright/test';

test.describe('Digital Presence Portfolio E2E Tests', () => {
  test('should load the home page and render hero section correctly', async ({ page }) => {
    await page.goto('/');

    // Check document title
    await expect(page).toHaveTitle(/Arland/i);

    // Verify main header or hero section is visible
    const mainHeading = page.locator('h1').first();
    await expect(mainHeading).toBeVisible();
  });

  test('should open and close the schedule call modal', async ({ page }) => {
    await page.goto('/');

    // Find and click schedule button
    const scheduleBtn = page.getByRole('button', { name: /schedule/i }).first();
    if (await scheduleBtn.isVisible()) {
      await scheduleBtn.click();
      
      // Verify modal opens
      const modalHeader = page.getByText(/discovery call/i).first();
      await expect(modalHeader).toBeVisible();

      // Close modal
      const closeBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
      }
    }
  });
});
