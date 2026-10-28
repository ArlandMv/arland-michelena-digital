/**
 * Ciclo 18 (#75): entrada de pre-render. `npm run build` la compila con `vite build --ssr`
 * y scripts/prerender.mjs inyecta el HTML resultante en dist/index.html, para que el
 * navegador pinte el hero sin esperar al bundle de React. main.tsx luego hidrata ese HTML.
 * Ver .docs/028-prerender-css-critico.md
 */
import {StrictMode} from 'react';
import {renderToString} from 'react-dom/server';
import App from './App.tsx';

export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
