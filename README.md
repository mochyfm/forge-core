# 🔨 @mochyfm/forge-core

**Núcleo compartido** para construir landings. NO se clona copiando la carpeta:
es un **paquete privado** (GitHub Packages) que cada landing instala como
dependencia. Así, al publicar una versión nueva del núcleo, todas las webs se
actualizan con `pnpm update` + redeploy.

- **Astro** → HTML estático, **0 KB de JS** por defecto.
- **Islas Preact** (`client:*`) solo para lo interactivo.
- **Tailwind v4** con tema en tokens.
- **Animaciones** ligeras: scroll-reveal (`IntersectionObserver`) + View Transitions.
- Cada landing despliega en **Cloudflare Pages** (estático).

## Qué exporta el núcleo

- `@mochyfm/forge-core/styles.css` — Tailwind + tokens de tema + animaciones.
- `@mochyfm/forge-core/config` — `defineSite()` y el tipo `SiteConfig`.
- `@mochyfm/forge-core/layouts/Base.astro` — `<head>`/SEO + View Transitions + scroll-reveal.
- `@mochyfm/forge-core/components/layout/{Header,Footer}.astro`
- `@mochyfm/forge-core/components/sections/*` — secciones de ejemplo.
- `@mochyfm/forge-core/components/islands/*` — islas Preact (p. ej. `MobileMenu`).

Todos los componentes reciben la config por **props** (`site={site}`), nunca
hardcodeada — así cada landing inyecta su propia marca.

## Desarrollo del núcleo (playground)

`src/pages/index.astro` es un playground que consume el propio núcleo igual que
lo hará una landing.

```bash
pnpm install
pnpm dev      # http://localhost:4321  (previsualiza el núcleo)
pnpm build
```

## Publicar una versión (GitHub Packages)

```bash
# token de GitHub con scope write:packages
export GITHUB_TOKEN=ghp_xxx
pnpm version patch        # sube 0.1.0 -> 0.1.1
pnpm publish              # publica en npm.pkg.github.com (privado)
```

## Consumir el núcleo en una landing nueva

1. Crear app Astro mínima con Preact + Tailwind (`pnpm create astro` + `astro add preact tailwind`).
2. `.npmrc` en la landing:
   ```
   @mochyfm:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
   ```
3. `pnpm add @mochyfm/forge-core`
4. En `src/styles/app.css` de la landing:
   ```css
   @import "@mochyfm/forge-core/styles.css";
   /* Tailwind v4 debe escanear las clases del paquete: */
   @source "../../node_modules/@mochyfm/forge-core/src";
   ```
5. Definir la config y componer la página:
   ```astro
   ---
   import Base from "@mochyfm/forge-core/layouts/Base.astro";
   import Header from "@mochyfm/forge-core/components/layout/Header.astro";
   import { defineSite } from "@mochyfm/forge-core/config";
   const site = defineSite({ /* tu marca */ });
   ---
   <Base site={site}><Header site={site} /> ... </Base>
   ```

## Actualizar todas las webs

1. Publica versión nueva del núcleo (arriba).
2. En cada landing: `pnpm update @mochyfm/forge-core` + push → Cloudflare redepliega.

## Deploy de una landing en Cloudflare Pages

- **Framework preset**: `Astro` · **Build command**: `pnpm build` · **Output**: `dist`
- Node desde `.nvmrc` (22.12.0) o variable `NODE_VERSION = 22.12.0`.
- La build de Cloudflare necesita el `GITHUB_TOKEN` (read:packages) como variable
  de entorno para instalar el paquete privado.
