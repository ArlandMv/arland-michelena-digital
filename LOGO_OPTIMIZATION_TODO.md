# 📋 TODO: Optimización y Rediseño Profesional del Logo

Documento de referencia para la optimización del logo en producción (`https://arlandstack.com/`).

---

## 🔍 1. Diagnóstico del Archivo Actual (`public/assets/aistudio/logo.png`)

- [x] **Inspección técnica realizada**:
  - **Dimensiones**: `1536 × 1024 px` (Aspect Ratio 3:2).
  - **Peso actual**: `1.94 MB (1,938 KB)` — ⚠️ *Excesivo para web (meta: < 50 KB o SVG)*.
  - **Fondo**: Blanco/gris con trama *(Requiere canal alfa transparente)*.
  - **Renderizado UI**: Cuadrado `32 × 32 px` (`h-8 w-8`) en Navbar/Footer.
  - **Referencia en código**:Actualmente en `src/data/portfolioData.ts`, `logoUrl` apunta a un enlace externo temporal de Google en lugar del asset local.

---

## 🛠️ 2. Lista de Tareas (Checklist de Acción)

### Fase A: Corrección Rápida en Código
- [ ] **Actualizar referencia local**: Cambiar `logoUrl` en `src/data/portfolioData.ts` de la URL externa de Google a `/assets/aistudio/logo.png`.

### Fase B: Optimización y Transparencia del Asset
- [ ] **Remover fondo**: Utilizar [Adobe Express Free Background Remover](https://express.adobe.com/tools/remove-background) o [Remove.bg](https://www.remove.bg/) para dejar el fondo 100% transparente.
- [ ] **Ajustar lienzo**: En [Figma](https://www.figma.com/) o Canva, crear un canvas cuadrado de `512 × 512 px` y centrar la figura del icosaedro/gema.
- [ ] **Convertir a Vectorial (SVG)**: Utilizar [Vectorizer.ai](https://vectorizer.ai/) para convertir el PNG recortado a `.svg` (~10 KB) o guardar como `logo.webp` / `logo.png` optimizado (< 50 KB).
- [ ] **Reemplazar archivo en el proyecto**: Guardar el nuevo asset en `public/assets/aistudio/logo.svg` (o `logo.png`).

### Fase C: Generación de Favicons para Navegador y Móviles
- [ ] **Generar favicons**: Pasar el asset final por [RealFaviconGenerator.net](https://realfavicongenerator.net/).
- [ ] **Colocar favicons**: Ubicar `favicon.ico`, `apple-touch-icon.png` y `site.webmanifest` en la carpeta `public/` y referenciarlos en `index.html`.

---

## 🤖 3. Master Prompt para IA (Midjourney / DALL-E 3 / Recraft.ai)

Si deseas re-generar o refinar la gema/icosaedro 3D desde cero en alta resolución:

```text
A modern tech logo symbol, 3D geometric regular icosahedron crystal gemstone, vibrant deep purple and magenta facets with metallic rose-gold borders and subtle orange glowing accents. Clean isometric design, sharp edges, dark luxury tech aesthetic. Isolated on pure black background or transparent background, flat logomark, vector style, minimal corporate identity icon, 8k resolution --no text, background grid, marble texture, realistic shadows
```

---

## 🧰 4. Herramientas Gratuitas Recomendadas

1. **Fondo transparente**: [Adobe Express Background Remover](https://express.adobe.com/tools/remove-background) / [Remove.bg](https://www.remove.bg/)
2. **Vectorizador a SVG**: [Vectorizer.ai](https://vectorizer.ai/) / [Vecteezy Vectorizer](https://www.vecteezy.com/vectorizer)
3. **Edición de canvas (512x512)**: [Figma Free](https://www.figma.com/) / [Canva](https://www.canva.com/)
4. **Generador de Favicons**: [RealFaviconGenerator.net](https://realfavicongenerator.net/)
