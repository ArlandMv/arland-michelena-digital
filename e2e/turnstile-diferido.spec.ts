import { test, expect, type Page } from '@playwright/test';

// Ciclo 15 (#65): Turnstile se carga solo cuando el formulario se acerca a la pantalla
// o al primer foco/toque. Se usa la instancia de Vite en :3001 (con site key de pruebas)
// y se simula api.js para que la prueba no dependa de la red de Cloudflare.
const BASE = 'http://localhost:3001';
const FAKE_TOKEN = 'token-simulado-turnstile';

function fakeApi(withToken: boolean) {
  return `window.turnstile = {
    render: function (el, opts) {
      window.__turnstileRenders = (window.__turnstileRenders || 0) + 1;
      window.__turnstileOpts = opts;
      var w = document.createElement('div');
      w.className = 'turnstile-simulado';
      w.style.height = '65px';
      el.appendChild(w);
      ${withToken ? `var i = document.createElement('input'); i.type = 'hidden'; i.name = 'cf-turnstile-response'; i.value = '${FAKE_TOKEN}'; el.appendChild(i);` : ''}
      return 'widget-1';
    },
    reset: function () {},
    remove: function () {}
  };`;
}

async function mockTurnstile(page: Page, withToken = true) {
  const requests: string[] = [];
  await page.route('https://challenges.cloudflare.com/**', (route) => {
    requests.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'application/javascript', body: fakeApi(withToken) });
  });
  return requests;
}

test('no descarga Turnstile al abrir la página; lo carga al acercarse al formulario', async ({ page }) => {
  const requests = await mockTurnstile(page);
  await page.goto(BASE + '/');
  await page.waitForLoadState('load');
  await page.waitForTimeout(800);
  expect(requests, 'api.js no debe pedirse en la carga inicial').toHaveLength(0);
  await expect(page.locator('#cf-turnstile-script')).toHaveCount(0);

  await page.locator('#contacto').scrollIntoViewIfNeeded();
  await expect(page.locator('#turnstile-widget .turnstile-simulado')).toHaveCount(1);
  expect(requests).toHaveLength(1);
  expect(requests[0]).toContain('render=explicit');
  const opts = await page.evaluate(() => (window as unknown as { __turnstileOpts: Record<string, string> }).__turnstileOpts);
  expect(opts).toMatchObject({ sitekey: '1x00000000000000000000AA', theme: 'dark', language: 'es' });
});

test('el envío incluye el token de Turnstile renderizado de forma diferida', async ({ page }) => {
  await mockTurnstile(page);
  let body: Record<string, unknown> = {};
  await page.route('**/api/contact', async (route) => {
    body = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto(BASE + '/');
  await page.fill('#contact-name', 'Persona de Prueba');
  await page.fill('#contact-email', 'prueba@example.com');
  await page.fill('#contact-message', 'Necesito integrar un sistema de pruebas automatizadas.');
  await expect(page.locator('#turnstile-widget input[name="cf-turnstile-response"]')).toHaveCount(1);
  await page.click('#contact-submit-button');
  await expect(page.locator('#form-success-message')).toBeVisible();
  expect(body).toMatchObject({ turnstileToken: FAKE_TOKEN, name: 'Persona de Prueba' });
  const renders = await page.evaluate(() => (window as unknown as { __turnstileRenders: number }).__turnstileRenders);
  expect(renders).toBe(1);
});

test('sin token todavía, el envío espera la verificación y no llama a /api/contact', async ({ page }) => {
  await mockTurnstile(page, false);
  let called = false;
  await page.route('**/api/contact', (route) => {
    called = true;
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await page.goto(BASE + '/');
  await page.fill('#contact-name', 'Persona de Prueba');
  await page.fill('#contact-email', 'prueba@example.com');
  await page.fill('#contact-message', 'Necesito integrar un sistema de pruebas automatizadas.');
  await expect(page.locator('#turnstile-widget .turnstile-simulado')).toHaveCount(1);
  await page.click('#contact-submit-button');
  await expect(page.locator('#form-error-message')).toContainText('verificación anti-bots');
  expect(called).toBe(false);
});
