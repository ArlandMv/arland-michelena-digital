import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

// #8: public/_headers define las cabeceras de seguridad que Cloudflare aplica a los assets.
const headers = readFileSync('public/_headers', 'utf8');

test('_headers incluye CSP, HSTS, nosniff, frame-ancestors y Referrer-Policy (#8)', () => {
  expect(headers).toMatch(/^\/\*$/m);
  expect(headers).toMatch(/Content-Security-Policy: .*default-src 'self'/);
  expect(headers).toMatch(/frame-ancestors 'none'/);
  expect(headers).toMatch(/object-src 'none'/);
  expect(headers).toMatch(/Strict-Transport-Security: max-age=31536000/);
  expect(headers).toMatch(/X-Content-Type-Options: nosniff/);
  expect(headers).toMatch(/Referrer-Policy: strict-origin-when-cross-origin/);
});

test('la CSP permite Google Fonts y Turnstile (#8)', () => {
  const csp = headers.match(/Content-Security-Policy: (.*)/)![1];
  expect(csp).toContain('https://fonts.googleapis.com');
  expect(csp).toContain('https://fonts.gstatic.com');
  expect(csp).toMatch(/script-src[^;]*https:\/\/challenges\.cloudflare\.com/);
  expect(csp).toMatch(/frame-src[^;]*https:\/\/challenges\.cloudflare\.com/);
  expect(csp).not.toContain("'unsafe-eval'");
});
