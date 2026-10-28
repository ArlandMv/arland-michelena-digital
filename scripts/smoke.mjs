#!/usr/bin/env node
/**
 * Smoke test contra producción (issue #36) · ver .docs/022-smoke-produccion.md
 *
 * Uso local:   npm run smoke
 * Variables:
 *   SMOKE_BASE_URL       Sitio a probar (por defecto https://arlandstack.com).
 *   SMOKE_WWW_URL        URL www que debe redirigir 301 a la raíz (por defecto https://www.<host>;
 *                        "off" para omitir el chequeo).
 *   SMOKE_EXPECTED_SHA   Si se define, espera a que producción sirva ese commit
 *                        (<meta name="build-commit">, lo inyecta vite.config.ts en Workers Builds).
 *   SMOKE_WAIT_SECONDS   Espera máxima para el commit esperado (por defecto 480 s).
 *   SMOKE_SKIP_API=1     Omite el POST a /api/contact.
 *   SMOKE_RETRY_BASE_MS  Base del backoff entre reintentos (por defecto 3000 ms; 4 intentos por chequeo).
 *
 * El POST a /api/contact usa un token de Turnstile falso: el Worker lo rechaza con 403
 * antes de llegar a Airtable, así que nunca crea leads. Un 503 significa que faltan secrets.
 */
import { appendFileSync } from 'node:fs';

const BASE = (process.env.SMOKE_BASE_URL || 'https://arlandstack.com').replace(/\/+$/, '');
const baseHost = new URL(BASE).host;
const WWW = process.env.SMOKE_WWW_URL ?? (baseHost.startsWith('www.') ? 'off' : `https://www.${baseHost}`);
const EXPECTED_SHA = (process.env.SMOKE_EXPECTED_SHA || '').trim();
const WAIT_SECONDS = Number(process.env.SMOKE_WAIT_SECONDS || 480);
const SKIP_API = process.env.SMOKE_SKIP_API === '1';
const EXPECTED_TITLE = /ARLAND/;
const UA = 'arlandstack-smoke/1.0 (+https://github.com/ArlandMv/arland-michelena-digital)';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bust = (path) => `${BASE}${path}${path.includes('?') ? '&' : '?'}smoke=${Date.now()}`;

async function get(url, init = {}) {
  const res = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
    ...init,
    headers: { 'user-agent': UA, 'cache-control': 'no-cache', ...(init.headers || {}) },
  });
  return res;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

/** Reintenta con backoff exponencial (errores transitorios de red o del edge). */
const RETRY_MS = Number(process.env.SMOKE_RETRY_BASE_MS || 3000);
async function retry(fn, { attempts = 4, baseMs = RETRY_MS } = {}) {
  let last;
  for (let i = 1; i <= attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      last = err;
      if (err?.noRetry || i === attempts) break;
      await sleep(baseMs * 2 ** (i - 1));
    }
  }
  throw last;
}

const results = [];
async function check(name, fn, opts) {
  const t0 = Date.now();
  try {
    const detail = await retry(fn, opts);
    results.push({ name, ok: true, detail: detail || '', ms: Date.now() - t0 });
    console.log(`✅ ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (err) {
    results.push({ name, ok: false, detail: err.message, ms: Date.now() - t0 });
    console.log(`❌ ${name} — ${err.message}`);
    if (process.env.GITHUB_ACTIONS) console.log(`::error title=Smoke: ${name}::${err.message}`);
  }
}

const commitOf = (html) => html.match(/<meta\s+name="build-commit"\s+content="([^"]*)"/i)?.[1] ?? '';

async function waitForCommit() {
  const deadline = Date.now() + WAIT_SECONDS * 1000;
  let served = '';
  let n = 0;
  while (true) {
    n++;
    try {
      const res = await get(bust('/'));
      served = commitOf(await res.text());
      if (res.status === 200 && served === EXPECTED_SHA) return `producción sirve ${EXPECTED_SHA.slice(0, 7)} (intento ${n})`;
    } catch (err) {
      served = `error de red: ${err.message}`;
    }
    if (Date.now() >= deadline) {
      const e = new Error(
        `tras ${WAIT_SECONDS} s producción sigue sirviendo "${served || 'sin meta build-commit'}" y no ${EXPECTED_SHA.slice(0, 7)}; revisa el build de Workers Builds`,
      );
      e.noRetry = true;
      throw e;
    }
    const pause = Math.min(20_000, Math.max(1000, deadline - Date.now()));
    console.log(`… esperando deploy de ${EXPECTED_SHA.slice(0, 7)} (sirve "${served.slice(0, 7) || '—'}"), reintento en ${Math.round(pause / 1000)} s`);
    await sleep(pause);
  }
}

let html = '';

async function main() {
  console.log(`Smoke test contra ${BASE}${EXPECTED_SHA ? ` (commit esperado ${EXPECTED_SHA.slice(0, 7)})` : ''}\n`);

  if (EXPECTED_SHA) await check('Deploy del commit esperado', waitForCommit, { attempts: 1 });

  await check('Home responde 200 con el título esperado', async () => {
    const res = await get(bust('/'));
    assert(res.status === 200, `status ${res.status}, se esperaba 200`);
    assert((res.headers.get('content-type') || '').includes('text/html'), `content-type ${res.headers.get('content-type')}`);
    html = await res.text();
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? '';
    assert(EXPECTED_TITLE.test(title), `título inesperado: "${title}"`);
    const commit = commitOf(html);
    return `"${title}"${commit ? ` · commit ${commit.slice(0, 7)}` : ''}`;
  });

  await check('Cabeceras de seguridad en la home (#8)', async () => {
    const res = await get(bust('/'));
    const h = (k) => res.headers.get(k) || '';
    const csp = h('content-security-policy');
    assert(csp.includes("default-src 'self'"), `CSP ausente o sin default-src 'self': "${csp.slice(0, 80)}"`);
    assert(csp.includes("frame-ancestors 'none'"), "CSP sin frame-ancestors 'none'");
    const maxAge = Number(h('strict-transport-security').match(/max-age=(\d+)/)?.[1] || 0);
    assert(maxAge >= 31536000, `HSTS max-age ${maxAge} < 31536000`);
    assert(h('x-content-type-options').toLowerCase() === 'nosniff', `X-Content-Type-Options "${h('x-content-type-options')}"`);
    assert(h('x-frame-options').toUpperCase() === 'DENY', `X-Frame-Options "${h('x-frame-options')}"`);
    return 'CSP, HSTS, nosniff y X-Frame-Options presentes';
  });

  if (WWW !== 'off') {
    await check('www redirige 301 a la raíz', async () => {
      const res = await get(WWW.replace(/\/+$/, '') + '/');
      const loc = res.headers.get('location') || '';
      assert(res.status === 301, `status ${res.status}, se esperaba 301`);
      assert(loc.replace(/\/+$/, '') === BASE, `location "${loc}", se esperaba ${BASE}/`);
      return `${WWW} → ${loc}`;
    });
  }

  await check('JS y CSS del build cargan', async () => {
    if (!html) html = await (await get(bust('/'))).text();
    const js = [...html.matchAll(/<script[^>]+src="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);
    const css = [...html.matchAll(/<link[^>]+href="(\/assets\/[^"]+\.css)"/g)].map((m) => m[1]);
    assert(js.length > 0, 'no se encontró ningún <script src="/assets/*.js"> en la home');
    assert(css.length > 0, 'no se encontró ningún <link href="/assets/*.css"> en la home');
    for (const [path, type] of [...js.map((p) => [p, 'javascript']), ...css.map((p) => [p, 'text/css'])]) {
      const res = await get(`${BASE}${path}`);
      assert(res.status === 200, `${path} → ${res.status}`);
      assert((res.headers.get('content-type') || '').includes(type), `${path} con content-type ${res.headers.get('content-type')}`);
      const body = await res.arrayBuffer();
      assert(body.byteLength > 100, `${path} vacío`);
    }
    return [...js, ...css].join(', ');
  });

  await check('Logo e imagen OG cargan', async () => {
    const og = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1];
    const urls = [`${BASE}/brand/logo-mark-320.webp`, `${BASE}/brand/logo-mark-128.webp`];
    if (og) urls.push(og.startsWith('http') ? og.replace(/^https?:\/\/[^/]+/, BASE) : `${BASE}${og}`);
    for (const url of urls) {
      const res = await get(url);
      assert(res.status === 200, `${url} → ${res.status}`);
      assert((res.headers.get('content-type') || '').startsWith('image/'), `${url} con content-type ${res.headers.get('content-type')}`);
    }
    return urls.map((u) => u.replace(BASE, '')).join(', ');
  });

  await check('robots.txt y sitemap.xml', async () => {
    const robots = await get(`${BASE}/robots.txt`);
    const rtxt = await robots.text();
    assert(robots.status === 200, `robots.txt → ${robots.status}`);
    assert(/^Sitemap:\s*https?:\/\//im.test(rtxt), 'robots.txt sin línea Sitemap:');
    const sm = await get(`${BASE}/sitemap.xml`);
    const stxt = await sm.text();
    assert(sm.status === 200, `sitemap.xml → ${sm.status}`);
    assert(stxt.includes('<urlset') && stxt.includes('<loc>'), 'sitemap.xml sin <urlset>/<loc>');
    return 'ambos 200 y con contenido válido';
  });

  if (!SKIP_API) {
    // Pocos intentos: el endpoint tiene rate-limit (5 cada 10 min por IP).
    await check('POST /api/contact con token falso → 403 turnstile (configuración cargada, sin crear leads)', async () => {
      const res = await get(`${BASE}/api/contact`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: 'Smoke test automatizado',
          email: 'smoke-test@example.com',
          organization: '',
          projectStage: 'idea',
          message: 'Smoke test de producción: token de Turnstile falso, no debe crear lead.',
          turnstileToken: 'smoke-test-token-falso',
          website: '',
        }),
      });
      const text = await res.text();
      let body = {};
      try {
        body = JSON.parse(text);
      } catch {
        /* cuerpo no JSON */
      }
      if (res.status === 503) {
        const e = new Error(`503 ${body.error || ''}: faltan secrets del Worker (AIRTABLE_TOKEN / TURNSTILE_SECRET_KEY / ids de Airtable)`);
        e.noRetry = true;
        throw e;
      }
      if (res.status === 429) {
        const e = new Error('429 rate_limited: demasiadas pruebas seguidas desde esta IP; reintentar en 10 min');
        e.noRetry = true;
        throw e;
      }
      assert(res.status === 403, `status ${res.status} (${text.slice(0, 120)}), se esperaba 403`);
      assert(body.error === 'turnstile', `error "${body.error}", se esperaba "turnstile"`);
      assert((res.headers.get('content-type') || '').includes('application/json'), 'respuesta sin JSON');
      assert(res.headers.get('x-content-type-options') === 'nosniff', '/api/contact sin nosniff');
      return '403 {"error":"turnstile"}';
    }, { attempts: 2, baseMs: RETRY_MS * 2 });
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} chequeos OK${failed.length ? ` · ${failed.length} fallaron` : ''}`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    const rows = results.map((r) => `| ${r.ok ? '✅' : '❌'} | ${r.name} | ${r.detail.replace(/\|/g, '\\|')} | ${(r.ms / 1000).toFixed(1)} s |`);
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      [`## Smoke test · ${BASE}`, '', '| | Chequeo | Detalle | Tiempo |', '|---|---|---|---|', ...rows, ''].join('\n'),
    );
  }
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
