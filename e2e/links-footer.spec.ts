import { test, expect } from '@playwright/test';

// #15: los links del footer apuntan a los perfiles reales y abren en pestaña nueva.
test('footer enlaza a los perfiles reales de Arland en pestaña nueva', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('#main-footer');
  const linkedin = footer.getByRole('link', { name: /linkedin/i });
  const github = footer.getByRole('link', { name: /github/i });
  await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/arland-michelena');
  await expect(github).toHaveAttribute('href', 'https://github.com/ArlandMv');

  // Ningún link externo genérico (raíz de una red social) en todo el sitio.
  const hrefs = await page.locator('a[href^="http"]').evaluateAll((as) =>
    as.map((a) => (a as HTMLAnchorElement).href),
  );
  for (const href of hrefs) {
    expect(href).not.toMatch(/^https?:\/\/(www\.)?(linkedin|github|twitter|x|instagram)\.com\/?$/);
  }

  // Todo link externo abre en pestaña nueva con rel seguro.
  const externos = page.locator('a[href^="http"]');
  const n = await externos.count();
  for (let i = 0; i < n; i++) {
    await expect(externos.nth(i)).toHaveAttribute('target', '_blank');
    await expect(externos.nth(i)).toHaveAttribute('rel', /noopener/);
  }
});

// #14: ningún texto visible usa #B66A43 (contraste < 4.5:1 sobre #141418 / #1B1B21).
test('ningún texto visible usa el tono #B66A43', async ({ page }) => {
  await page.goto('/');
  const offenders = await page.evaluate(() =>
    Array.from(document.querySelectorAll('body *'))
      .filter((el) => {
        const hasText = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
        );
        return hasText && getComputedStyle(el).color === 'rgb(182, 106, 67)';
      })
      .map((el) => el.textContent?.trim().slice(0, 40)),
  );
  expect(offenders).toEqual([]);
});
