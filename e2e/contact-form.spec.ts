import { test, expect } from '@playwright/test';

async function fillForm(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.fill('#contact-name', 'Persona de Prueba');
  await page.fill('#contact-email', 'prueba@example.com');
  await page.fill('#contact-organization', 'Empresa Test');
  await page.fill('#contact-message', 'Necesito integrar un sistema de pruebas automatizadas.');
}

test('envía el formulario a /api/contact y muestra éxito', async ({ page }) => {
  let body: Record<string, unknown> = {};
  await page.route('**/api/contact', async (route) => {
    body = route.request().postDataJSON();
    await new Promise((r) => setTimeout(r, 300));
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await fillForm(page);
  await page.click('#contact-submit-button');
  await expect(page.locator('#contact-submit-button')).toContainText('Enviando');
  await expect(page.locator('#form-success-message')).toBeVisible();
  expect(body).toMatchObject({ name: 'Persona de Prueba', email: 'prueba@example.com', projectStage: 'idea', website: '' });
});

test('muestra error si el servidor rechaza el envío', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 403, contentType: 'application/json', body: '{"ok":false,"error":"turnstile"}' }),
  );
  await fillForm(page);
  await page.click('#contact-submit-button');
  await expect(page.locator('#form-error-message')).toContainText('verificar');
  await expect(page.locator('#contact-form')).toBeVisible();
});
