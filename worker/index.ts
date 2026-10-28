/**
 * Worker de arlandstack.com.
 * - POST /api/contact: valida, aplica honeypot + rate-limit, verifica Turnstile y crea el lead en Airtable.
 * - Resto de rutas: assets estáticos (SPA) vía binding ASSETS.
 * Secrets/vars (nunca en el repo): AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID, TURNSTILE_SECRET_KEY.
 * Ver .docs/001-formulario-contacto.md y .docs/003-anti-spam.md.
 */

interface Env {
  ASSETS: { fetch(req: Request): Promise<Response> };
  AIRTABLE_TOKEN?: string;
  AIRTABLE_BASE_ID?: string;
  AIRTABLE_TABLE_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
}

export const PROJECT_STAGES: Record<string, string> = {
  idea: 'Idea inicial / Definición',
  desarrollo: 'En desarrollo activo',
  produccion: 'En producción (requiere mejoras)',
  migracion: 'Migración / Refactorización',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 254, organization: 160, message: 5000 };

// Rate-limit best-effort por instancia (complementar con regla WAF de Cloudflare).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

/** Solo para pruebas: vacía el contador de rate-limit. */
export function resetRateLimit() {
  hits.clear();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      // #8: cabeceras de seguridad también en las respuestas del Worker.
      'x-content-type-options': 'nosniff',
      'strict-transport-security': 'max-age=31536000; includeSubDomains',
      'referrer-policy': 'strict-origin-when-cross-origin',
      'content-security-policy': "default-src 'none'; frame-ancestors 'none'",
    },
  });

export function validate(input: Record<string, unknown>) {
  const s = (k: string) => (typeof input[k] === 'string' ? (input[k] as string).trim() : '');
  const data = {
    name: s('name'),
    email: s('email'),
    organization: s('organization'),
    projectStage: s('projectStage'),
    message: s('message'),
  };
  const errors: string[] = [];
  if (!data.name || data.name.length > LIMITS.name) errors.push('name');
  if (!EMAIL_RE.test(data.email) || data.email.length > LIMITS.email) errors.push('email');
  if (data.organization.length > LIMITS.organization) errors.push('organization');
  if (!(data.projectStage in PROJECT_STAGES)) errors.push('projectStage');
  if (data.message.length < 10 || data.message.length > LIMITS.message) errors.push('message');
  return { data, errors };
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  if (!token) return false;
  // Si siteverify no responde, se trata como verificación fallida (nunca 500 sin cuerpo).
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const out = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (out.success !== true) console.warn('contact: Turnstile rechazó el token', out['error-codes']);
    return out.success === true;
  } catch (err) {
    console.error('contact: siteverify no disponible', err);
    return false;
  }
}

export async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'method_not_allowed' });
  if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID || !env.AIRTABLE_TABLE_ID || !env.TURNSTILE_SECRET_KEY) {
    console.error('contact: faltan variables de entorno');
    return json(503, { ok: false, error: 'not_configured' });
  }

  let input: Record<string, unknown>;
  try {
    input = (await request.json()) as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, error: 'invalid_json' });
  }

  const ip = request.headers.get('CF-Connecting-IP') ?? '';

  // Honeypot: un bot que llena el campo oculto recibe "éxito" sin guardar nada.
  if (typeof input.website === 'string' && input.website.trim() !== '') return json(200, { ok: true });

  if (ip && rateLimited(ip)) return json(429, { ok: false, error: 'rate_limited' });

  const { data, errors } = validate(input);
  if (errors.length) return json(422, { ok: false, error: 'validation', fields: errors });

  const token = typeof input.turnstileToken === 'string' ? input.turnstileToken : '';
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip))) {
    return json(403, { ok: false, error: 'turnstile' });
  }

  let res: Response;
  try {
    res = await fetch(
    `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        typecast: true,
        records: [
          {
            fields: {
              Nombre: data.name,
              Email: data.email,
              Empresa: data.organization,
              'Estado del proyecto': PROJECT_STAGES[data.projectStage],
              'Qué necesita': data.message,
              Recibido: new Date().toISOString(),
              Origen: 'Formulario web',
              'Estado del lead': 'Nuevo',
            },
          },
        ],
      }),
    },
  );
  } catch (err) {
    console.error('contact: Airtable no disponible', err);
    return json(502, { ok: false, error: 'upstream' });
  }
  if (!res.ok) {
    console.error('contact: Airtable respondió', res.status, await res.text());
    return json(502, { ok: false, error: 'upstream' });
  }
  return json(200, { ok: true });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      try {
        return await handleContact(request, env);
      } catch (err) {
        // Cualquier error inesperado responde JSON (antes podía salir un 500 sin cuerpo).
        console.error('contact: error inesperado', err);
        return json(500, { ok: false, error: 'internal' });
      }
    }
    if (url.pathname.startsWith('/api/')) return json(404, { ok: false, error: 'not_found' });
    return env.ASSETS.fetch(request);
  },
};
