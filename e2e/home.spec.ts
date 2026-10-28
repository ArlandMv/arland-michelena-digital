import { test, expect } from '@playwright/test';

test.describe('Portada', () => {
  test('carga la portada y muestra el hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Arland/i);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  // #34: reemplaza la prueba obsoleta que buscaba un botón "schedule" que ya no existe
  // (y pasaba sin verificar nada). El modal hoy propone el horario por WhatsApp (#4).
  test('el modal de agenda abre y cierra con su botón', async ({ page }) => {
    await page.goto('/');
    await page.click('#header-profile-icon');
    const dialog = page.locator('#schedule-modal-dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Cerrar modal' }).click();
    await expect(dialog).toBeHidden();
  });
});
