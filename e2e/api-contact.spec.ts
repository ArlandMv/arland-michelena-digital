/**
 * Pruebas del endpoint POST /api/contact (issue #33).
 * Ejecutan el handler real de worker/index.ts en Node, con Turnstile y Airtable simulados
 * (se reemplaza globalThis.fetch). No hacen llamadas de red ni escriben en Airtable.
 */
import { test, expect } from '@playwright/test';
import worker, { resetRateLimit } from '../worker/index';

type Call = { url: string; init?: RequestInit };

const ENV = {
  ASSETS: { fetch: async () => new Response('asset') },
  AIRTABLE_TOKEN: 'test-token',
  AIRTABLE_BASE_ID: 'appTEST',
  AIRTABLE_TABLE_ID: 'tblTEST',
  TURNSTILE_SECRET_KEY: 'test-secret',
};

const VALID = {
  name: 'Persona de Prueba',
  email: 'prueba@example.com',
  organization: 'Empresa Test',
  projectStage: 'desarrollo',
  message: 'Necesito integrar un sistema con pruebas.',
  website: '',
  turnstileToken: 'token-ok',
};

let calls: Call[] = [];
let turnstileOk = true;
let airtable: () => Response | Promise<Response> = () => new Response('{"records":[]}', { status: 200 });
const realFetch = globalThis.fetch;

test.beforeEach(() => {
  calls = [];
  turnstileOk = true;
  airtable = () => new Response('{"records":[]}', { status: 200 });
  resetRateLimit();
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input instanceof Request ? input.url : input);
    calls.push({ url, init });
    if (url.includes('turnstile')) return new Response(JSON.stringify({ success: turnstileOk }));
    if (url.includes('api.airtable.com')) return airtable();
    throw new Error(`fetch inesperado: ${url}`);
  }) as typeof fetch;
});

test.afterEach(() => {
  globalThis.fetch = realFetch;
});

function post(body: unknown, { ip = '203.0.113.1', raw = false, env = ENV } = {}) {
  return worker.fetch(
    new Request('https://arlandstack.com/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'CF-Connecting-IP': ip },
      body: raw ? (body as string) : JSON.stringify(body),
    }),
    env,
  );
}

const airtableCalls = () => calls.filter((c) => c.url.includes('api.airtable.com'));

test('éxito: envía a Airtable los campos correctos', async () => {
  const res = await post(VALID);
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual({ ok: true });
  const [call] = airtableCalls();
  expect(call.url).toBe('https://api.airtable.com/v0/appTEST/tblTEST');
  expect((call.init?.headers as Record<string, string>).Authorization).toBe('Bearer test-token');
  const sent = JSON.parse(String(call.init?.body));
  expect(sent.typecast).toBe(true);
  expect(sent.records[0].fields).toMatchObject({
    Nombre: 'Persona de Prueba',
    Email: 'prueba@example.com',
    Empresa: 'Empresa Test',
    'Estado del proyecto': 'En desarrollo activo',
    'Qué necesita': 'Necesito integrar un sistema con pruebas.',
    Origen: 'Formulario web',
    'Estado del lead': 'Nuevo',
  });
});

test('validación: 422 con la lista de campos inválidos', async () => {
  const res = await post({ name: '', email: 'no-es-email', projectStage: 'otro', message: 'corto' });
  expect(res.status).toBe(422);
  expect(res.headers.get('content-type')).toContain('application/json');
  expect(await res.json()).toEqual({ ok: false, error: 'validation', fields: ['name', 'email', 'projectStage', 'message'] });
  expect(calls).toHaveLength(0);
});

test('JSON inválido: 400 invalid_json', async () => {
  const res = await post('{malo', { raw: true });
  expect(res.status).toBe(400);
  expect(await res.json()).toMatchObject({ error: 'invalid_json' });
});

test('método distinto de POST: 405', async () => {
  const res = await worker.fetch(new Request('https://arlandstack.com/api/contact'), ENV);
  expect(res.status).toBe(405);
  expect(await res.json()).toMatchObject({ error: 'method_not_allowed' });
});

test('honeypot con contenido: 200 silencioso sin escribir en Airtable', async () => {
  const res = await post({ ...VALID, website: 'https://spam.example' });
  expect(res.status).toBe(200);
  expect(calls).toHaveLength(0);
});

test('rate limit: el 6.º envío en 10 min por IP responde 429', async () => {
  for (let i = 0; i < 5; i++) expect((await post(VALID, { ip: '198.51.100.7' })).status).toBe(200);
  const res = await post(VALID, { ip: '198.51.100.7' });
  expect(res.status).toBe(429);
  expect(await res.json()).toMatchObject({ error: 'rate_limited' });
  // Otra IP no se ve afectada.
  expect((await post(VALID, { ip: '198.51.100.8' })).status).toBe(200);
});

test('Turnstile inválido o ausente: 403 turnstile y no escribe en Airtable', async () => {
  turnstileOk = false;
  let res = await post(VALID);
  expect(res.status).toBe(403);
  expect(await res.json()).toMatchObject({ error: 'turnstile' });
  res = await post({ ...VALID, turnstileToken: '' });
  expect(res.status).toBe(403);
  expect(airtableCalls()).toHaveLength(0);
});

test('Turnstile caído (siteverify lanza error): 403 JSON, nunca 500 sin cuerpo', async () => {
  globalThis.fetch = (async () => {
    throw new Error('red caída');
  }) as typeof fetch;
  const res = await post(VALID);
  expect(res.status).toBe(403);
  expect(await res.json()).toMatchObject({ error: 'turnstile' });
});

test('falta configuración: 503 not_configured', async () => {
  const res = await post(VALID, { env: { ...ENV, AIRTABLE_TOKEN: undefined } as typeof ENV });
  expect(res.status).toBe(503);
  expect(await res.json()).toMatchObject({ error: 'not_configured' });
});

test('Airtable con error: 502 upstream sin filtrar detalles', async () => {
  airtable = () => new Response('{"error":"INVALID_PERMISSIONS secreto-interno"}', { status: 403 });
  const res = await post(VALID);
  expect(res.status).toBe(502);
  const text = await res.text();
  expect(JSON.parse(text)).toEqual({ ok: false, error: 'upstream' });
  expect(text).not.toContain('secreto');
});

test('Airtable inaccesible (error de red): 502 upstream', async () => {
  airtable = () => {
    throw new Error('ECONNRESET');
  };
  const res = await post(VALID);
  expect(res.status).toBe(502);
  expect(await res.json()).toMatchObject({ error: 'upstream' });
});

test('otras rutas /api/* responden 404 JSON', async () => {
  const res = await worker.fetch(new Request('https://arlandstack.com/api/otra'), ENV);
  expect(res.status).toBe(404);
  expect(await res.json()).toMatchObject({ error: 'not_found' });
});
