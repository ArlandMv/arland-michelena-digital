import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

/**
 * #36: publica el commit del build en <meta name="build-commit"> para que el smoke test
 * (scripts/smoke.mjs) sepa cuándo producción ya sirve el commit recién pusheado.
 * Workers Builds inyecta WORKERS_CI_COMMIT_SHA; en GitHub Actions existe GITHUB_SHA.
 */
function buildCommit(): Plugin {
  const sha = (process.env.WORKERS_CI_COMMIT_SHA || process.env.GITHUB_SHA || 'local').replace(/[^0-9a-zA-Z]/g, '');
  return {
    name: 'build-commit',
    transformIndexHtml: () => [{tag: 'meta', attrs: {name: 'build-commit', content: sha}, injectTo: 'head'}],
  };
}

/**
 * Ciclo 12: precarga las fuentes del primer render (IBM Plex Sans latin 400/500/600) que
 * Vite emite con hash, para que el navegador no espere a leer el CSS antes de pedirlas.
 */
function preloadFonts(): Plugin {
  const wanted = /ibm-plex-sans-latin-(400|500|600)-normal.*\.woff2$/;
  return {
    name: 'preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: (_html, ctx) =>
        Object.keys(ctx.bundle ?? {})
          .filter((f) => wanted.test(f))
          .map((f) => ({
            tag: 'link',
            attrs: {rel: 'preload', href: `/${f}`, as: 'font', type: 'font/woff2', crossorigin: ''},
            injectTo: 'head' as const,
          })),
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), buildCommit(), preloadFonts()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
