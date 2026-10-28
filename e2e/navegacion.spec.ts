import { test, expect, type Page } from '@playwright/test';

// #34: navegación en escritorio y móvil, anclas y ausencia de scroll horizontal.
const SECCIONES = [
  { label: 'Servicios', id: 'servicios' },
  { label: 'Trabajo', id: 'trabajo' },
  { label: 'Capacidades', id: 'capacidades' },
  { label: 'Proceso', id: 'proceso' },
  { label: 'Sobre mí', id: 'sobre-mi' },
];

async function seccionEnPantalla(page: Page, id: string) {
  // La sección debe quedar cerca del borde superior (bajo el navbar fijo de 80 px) o dentro del viewport.
  await expect
    .poll(async () =>
      page.evaluate((sid) => {
        const r = document.getElementById(sid)!.getBoundingClientRect();
        return r.top < window.innerHeight * 0.6 && r.bottom > 80;
      }, id),
    )
    .toBe(true);
}

test('cada sección del menú existe en la página', async ({ page }) => {
  await page.goto('/');
  for (const s of [...SECCIONES, { id: 'contacto' }]) {
    await expect(page.locator(`#${s.id}`)).toHaveCount(1);
  }
});

test('sin scroll horizontal', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  const { scrollW, clientW } = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  }));
  expect(scrollW).toBeLessThanOrEqual(clientW);
});

test.describe('escritorio', () => {
  test.skip(({ isMobile }) => isMobile, 'solo escritorio');

  for (const s of SECCIONES) {
    test(`navbar → #${s.id}`, async ({ page }) => {
      await page.goto('/');
      await page.locator('#desktop-navigation').getByRole('link', { name: s.label }).click();
      await expect(page).toHaveURL(new RegExp(`#${s.id}$`));
      await seccionEnPantalla(page, s.id);
    });
  }

  test('CTA del header lleva a #contacto', async ({ page }) => {
    await page.goto('/');
    await page.click('#header-cta-button');
    await seccionEnPantalla(page, 'contacto');
  });
});

test.describe('móvil', () => {
  test.skip(({ isMobile }) => !isMobile, 'solo móvil');

  test('el menú de escritorio se oculta y el botón de menú es visible', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#desktop-navigation')).toBeHidden();
    await expect(page.locator('#mobile-menu-toggle')).toBeVisible();
  });

  test('el menú móvil abre y cierra', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('#mobile-menu-toggle');
    await toggle.click();
    await expect(page.locator('#mobile-menu-drawer')).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.click();
    await expect(page.locator('#mobile-menu-drawer')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  for (const s of SECCIONES) {
    test(`menú móvil → #${s.id} y se cierra`, async ({ page }) => {
      await page.goto('/');
      await page.click('#mobile-menu-toggle');
      await page.locator('#mobile-menu-drawer').getByRole('link', { name: s.label }).click();
      await expect(page).toHaveURL(new RegExp(`#${s.id}$`));
      await expect(page.locator('#mobile-menu-drawer')).toBeHidden();
      await seccionEnPantalla(page, s.id);
    });
  }

  test('CTA de WhatsApp del menú móvil es visible y apunta a wa.me', async ({ page }) => {
    await page.goto('/');
    await page.click('#mobile-menu-toggle');
    const cta = page.locator('#mobile-whatsapp-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /^https:\/\/wa\.me\//);
    await expect(cta).toHaveAttribute('target', '_blank');
  });

  test('CTA de WhatsApp de contacto es visible y clickeable', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('#whatsapp-cta');
    await cta.scrollIntoViewIfNeeded();
    await expect(cta).toBeVisible();
    // trial: verifica que nada lo tapa y que recibiría el toque, sin abrir WhatsApp.
    await cta.click({ trial: true });
  });
});
