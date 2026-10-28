# 029 · Reintento automático de Workers Builds en el smoke de producción

## Problema
En dos ocasiones el build de Cloudflare Workers Builds para `main` falló en la etapa de
clonado del repositorio (error al clonar / "unable to verify Worker"), un fallo transitorio
ajeno al código. Producción quedó sirviendo el commit anterior, el smoke test
(`.github/workflows/smoke.yml`) agotó la espera del `<meta name="build-commit">` y abrió el
issue de fallo. La solución manual era entrar al dashboard y pulsar "Retry build".

## Alternativas evaluadas
1. **Reintento manual (dashboard o "Rerun" del Check Run en GitHub).** Funciona, pero
   depende de que alguien lo note.
2. **Desplegar desde GitHub Actions con `wrangler deploy`.** Elimina la dependencia de
   Workers Builds, pero duplica la canalización de deploy y mueve secretos de build a Actions.
3. **Consultar la API de Workers Builds y relanzar solo si el build falló** (elegida).
   Mantiene Workers Builds como única fuente de deploy y automatiza solo el caso transitorio.

## Solución
- `scripts/deploy-guard.mjs` espera el commit en producción (480 s). Si vence:
  - Obtiene el `tag` del Worker `arland-michelena-digital` (`GET /accounts/{id}/workers/scripts`).
  - Lista sus builds (`GET /accounts/{id}/builds/workers/{tag}/builds`) y toma el de `main`
    para el commit esperado.
  - Si terminó en `fail`/`cancelled`/`terminated`, lo relanza con
    `POST /accounts/{id}/builds/triggers/{trigger_uuid}/builds` `{ branch, commit_hash }`
    y vuelve a esperar. Si sigue en curso, solo espera. Máximo 2 reintentos.
- Después corre el smoke normal; si algo falla sigue abriendo/comentando el issue.
- Secreto `CLOUDFLARE_API_TOKEN` (permiso Workers Builds) y variable `CLOUDFLARE_ACCOUNT_ID`
  en el repo. El token se enmascara con `::add-mask::` y nunca se imprime.
- Verificación local en solo lectura: `node scripts/deploy-guard.mjs --check`
  (muestra el último build de `main`, no relanza nada).

Referencia: https://developers.cloudflare.com/api/resources/workers_builds/
