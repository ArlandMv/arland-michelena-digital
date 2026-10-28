import { test, expect } from '@playwright/test';

test('el modal propone el horario por WhatsApp en vez de simular una reserva (#4)', async ({ page }) => {
  await page.goto('/');
  await page.click('#header-profile-icon');
  const dialog = page.locator('#schedule-modal-dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).not.toContainText('8 Sep');
  await expect(dialog).toContainText('aún no hay reserva automática');

  await dialog.locator('input[type="text"]').first().fill('Persona de Prueba');
  await dialog.locator('input[type="email"]').fill('prueba@example.com');
  const popupPromise = page.waitForEvent('popup');
  await page.click('#schedule-submit-button');
  const popup = await popupPromise;
  const url = new URL(popup.url().startsWith('https://wa.me') ? popup.url() : await popup.evaluate(() => location.href));
  expect(url.href).toMatch(/wa\.me|whatsapp/);
  await expect(dialog).toContainText('Solicitud lista en WhatsApp');
  await expect(dialog).not.toContainText('agendada con éxito');
});

test('las fechas son los próximos días hábiles', async ({ page }) => {
  await page.goto('/');
  await page.click('#header-profile-icon');
  const labels = await page.locator('#schedule-form button[type="button"]').allTextContents();
  const fechas = labels.filter((l) => /\d/.test(l) && !/:/.test(l));
  expect(fechas).toHaveLength(5);
  for (const f of fechas) expect(f).not.toMatch(/^(Sáb|Dom)/i);
});
