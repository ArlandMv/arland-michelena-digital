import { test, expect } from '@playwright/test';

test('CTA de WhatsApp apunta a wa.me con mensaje prellenado', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('#whatsapp-cta');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveText(/Conversemos por WhatsApp/);
  await expect(cta).toHaveAttribute('target', '_blank');
  await expect(cta).toHaveAttribute('rel', /noopener/);
  const href = (await cta.getAttribute('href'))!;
  const url = new URL(href);
  expect(url.origin).toBe('https://wa.me');
  expect(url.pathname).toMatch(/^\/\d{8,15}$/);
  expect(url.searchParams.get('text')).toContain('vi tu portafolio en arlandstack.com');
});
