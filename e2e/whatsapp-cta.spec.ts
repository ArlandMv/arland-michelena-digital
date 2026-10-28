import { test, expect } from '@playwright/test';

test('CTA de WhatsApp apunta a wa.me con el número y mensaje prellenado', async ({ page }) => {
  await page.goto('/');
  const cta = page.locator('#whatsapp-cta');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveText(/Conversemos por WhatsApp/);
  await expect(cta).toHaveAttribute('target', '_blank');
  await expect(cta).toHaveAttribute('rel', /noopener/);
  const url = new URL((await cta.getAttribute('href'))!);
  expect(url.origin).toBe('https://wa.me');
  expect(url.pathname).toBe('/56997722404');
  expect(url.searchParams.get('text')).toContain('vi tu portafolio en arlandstack.com');
});

test('el ícono de agenda del header abre el modal de propuesta (#4)', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('#header-profile-icon');
  await expect(btn).toBeEnabled();
  await btn.click();
  await expect(page.locator('#schedule-modal-dialog')).toBeVisible();
});
