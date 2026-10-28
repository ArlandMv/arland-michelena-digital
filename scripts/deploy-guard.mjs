#!/usr/bin/env node
/**
 * Guardia de deploy (ver .docs/029-reintento-workers-builds.md)
 *
 * Espera a que producción sirva <meta name="build-commit"> = GUARD_SHA. Si la espera vence,
 * consulta la API de Cloudflare Workers Builds del Worker y, si el build de ese commit en main
 * falló (p. ej. error al clonar / "unable to verify Worker"), lo relanza por la API y vuelve
 * a esperar. Máximo GUARD_MAX_RETRIES relanzamientos (por defecto 2).
 *
 * Variables:
 *   GUARD_SHA               Commit esperado (obligatorio salvo con --check).
 *   GUARD_BASE_URL          Sitio (por defecto https://arlandstack.com).
 *   GUARD_WAIT_SECONDS      Espera por intento (por defecto 480 s).
 *   GUARD_MAX_RETRIES       Relanzamientos máximos (por defecto 2).
 *   GUARD_BRANCH            Rama del build (por defecto main).
 *   CF_WORKER_NAME          Worker (por defecto arland-michelena-digital).
 *   CLOUDFLARE_API_TOKEN    Token con permiso Workers Builds (nunca se imprime).
 *   CLOUDFLARE_ACCOUNT_ID   Cuenta de Cloudflare.
 *
 * Modo --check: solo lectura. Muestra el último build de la rama; no espera ni relanza.
 *
 * Endpoints (https://developers.cloudflare.com/api/resources/workers_builds/):
 *   GET  /accounts/{id}/workers/scripts                         → tag (external_script_id) del Worker
 *   GET  /accounts/{id}/builds/workers/{external_script_id}/builds
 *   POST /accounts/{id}/builds/triggers/{trigger_uuid}/builds    { branch, commit_hash }
 */
const CHECK_ONLY = process.argv.includes('--check');
const BASE = (process.env.GUARD_BASE_URL || 'https://arlandstack.com').replace(/\/+$/, '');
const SHA = (process.env.GUARD_SHA || '').trim();
const WAIT = Number(process.env.GUARD_WAIT_SECONDS || 480);
const MAX_RETRIES = Number(process.env.GUARD_MAX_RETRIES ?? 2);
const BRANCH = process.env.GUARD_BRANCH || 'main';
const WORKER = process.env.CF_WORKER_NAME || 'arland-michelena-digital';
const TOKEN = (process.env.CLOUDFLARE_API_TOKEN || '').trim();
const ACCOUNT = (process.env.CLOUDFLARE_ACCOUNT_ID || '').trim();
const API = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}`;
const FAILED = new Set(['fail', 'cancelled', 'terminated']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const short = (s) => (s || '').slice(0, 7);
const gha = !!process.env.GITHUB_ACTIONS;

async function cf(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    signal: AbortSignal.timeout(20_000),
    headers: { authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json' },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    const msg = (body.errors || []).map((e) => `${e.code}: ${e.message}`).join('; ') || `HTTP ${res.status}`;
    throw new Error(`API Cloudflare ${init.method || 'GET'} ${path.split('?')[0]} → ${msg}`);
  }
  return body.result;
}

async function servedCommit() {
  try {
    const res = await fetch(`${BASE}/?guard=${Date.now()}`, {
      signal: AbortSignal.timeout(20_000),
      headers: { 'cache-control': 'no-cache' },
    });
    const html = await res.text();
    return html.match(/<meta\s+name="build-commit"\s+content="([^"]*)"/i)?.[1] ?? '';
  } catch {
    return '';
  }
}

async function waitForCommit(label) {
  const deadline = Date.now() + WAIT * 1000;
  let served = '';
  while (Date.now() < deadline) {
    served = await servedCommit();
    if (served === SHA) {
      console.log(`✅ producción sirve ${short(SHA)} (${label})`);
      return true;
    }
    console.log(`… esperando ${short(SHA)} (sirve "${short(served) || '—'}")`);
    await sleep(20_000);
  }
  console.log(`⏱️  ${label}: tras ${WAIT} s producción sigue sirviendo "${short(served) || '—'}"`);
  return false;
}

let scriptTag;
async function builds() {
  if (!scriptTag) {
    const scripts = await cf('/workers/scripts');
    scriptTag = scripts.find((s) => s.id === WORKER)?.tag;
    if (!scriptTag) throw new Error(`no encontré el Worker "${WORKER}" en la cuenta`);
  }
  const list = await cf(`/builds/workers/${scriptTag}/builds?per_page=25`);
  return list.filter((b) => b.build_trigger_metadata?.branch === BRANCH);
}

const describe = (b) =>
  `${b.build_uuid} · ${short(b.build_trigger_metadata?.commit_hash)} · ${b.status}/${b.build_outcome ?? '—'} · ${b.created_on}`;

async function main() {
  if (!TOKEN || !ACCOUNT) throw new Error('faltan CLOUDFLARE_API_TOKEN o CLOUDFLARE_ACCOUNT_ID');
  if (gha) console.log(`::add-mask::${TOKEN}`);

  if (CHECK_ONLY) {
    const list = await builds();
    console.log(list.length ? `Último build de ${BRANCH}: ${describe(list[0])}` : `sin builds de ${BRANCH}`);
    return;
  }
  if (!SHA) throw new Error('falta GUARD_SHA');

  if (await waitForCommit('espera inicial')) return;

  for (let retry = 1; retry <= MAX_RETRIES; retry++) {
    const list = await builds();
    const forSha = list.filter((b) => b.build_trigger_metadata?.commit_hash === SHA);
    const latest = forSha[0] || list[0];
    if (!latest) throw new Error(`no hay builds de ${BRANCH} en Workers Builds`);
    console.log(`Último build de ${BRANCH}: ${describe(latest)}`);

    if (latest.status !== 'stopped') {
      console.log('El build sigue en curso; espero otra vuelta sin relanzar.');
    } else if (FAILED.has(latest.build_outcome)) {
      const trigger = latest.trigger?.trigger_uuid;
      if (!trigger) throw new Error('el build no informa trigger_uuid; no puedo relanzarlo');
      const nuevo = await cf(`/builds/triggers/${trigger}/builds`, {
        method: 'POST',
        body: JSON.stringify({ branch: BRANCH, commit_hash: SHA }),
      });
      console.log(`🔁 Relanzado (${retry}/${MAX_RETRIES}): build ${nuevo?.build_uuid ?? '(sin uuid)'}`);
      if (gha) console.log(`::warning title=Workers Builds relanzado::El build ${latest.build_uuid} falló; se relanzó (${retry}/${MAX_RETRIES}).`);
    } else {
      console.log(`El build terminó "${latest.build_outcome}" pero producción no sirve el commit; espero otra vuelta.`);
    }
    if (await waitForCommit(`tras reintento ${retry}`)) return;
  }
  throw new Error(`producción no sirve ${short(SHA)} tras ${MAX_RETRIES} reintentos de Workers Builds`);
}

main().catch((err) => {
  console.log(`❌ ${err.message}`);
  if (gha) console.log(`::error title=Guardia de deploy::${err.message}`);
  process.exit(1);
});
