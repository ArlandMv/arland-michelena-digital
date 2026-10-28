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

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), buildCommit()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
