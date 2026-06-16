# 🔨 Astro Forge

Plantilla base (esqueleto madre) para clonar **landing pages** rápido.

- **Astro** → HTML estático, **0 KB de JS** por defecto.
- **Islas Preact** (`client:*`) solo para lo interactivo (menús, carruseles, formularios…).
- **Tailwind v4** con tema centralizado en tokens.
- **Animaciones** ligeras: scroll-reveal por `IntersectionObserver` + View Transitions, sin librerías pesadas.
- **Deploy en Cloudflare Pages** (salida estática).

## Comandos

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # genera ./dist
pnpm preview  # sirve ./dist en local
```

## Estructura

```
src/
├── config/site.ts            # ⭐ marca, nav, contacto (editar al clonar)
├── styles/global.css         # ⭐ tokens de tema: colores, fuentes, animaciones
├── layouts/Base.astro        # <head>/SEO + View Transitions + scroll-reveal
├── components/
│   ├── layout/               # Header.astro, Footer.astro
│   ├── sections/             # Hero.astro, Features.astro… (una por sección)
│   └── islands/              # MobileMenu.tsx… (componentes Preact interactivos)
└── pages/index.astro         # compone el layout + secciones
```

## Cómo clonar una landing nueva

1. Copia toda la carpeta a `mi-nueva-landing/`.
2. Edita **`src/config/site.ts`** (nombre, nav, contacto, CTA, URL).
3. Edita los **tokens** de `src/styles/global.css` (colores `--color-brand*`, fuentes).
4. Sustituye/añade secciones en `src/components/sections/` y referéncialas en `pages/index.astro`.
5. Mete tus imágenes en `public/` y el favicon (`public/favicon.svg`).
6. `pnpm install && pnpm dev` para trabajar; `pnpm build` para publicar.

### Patrones

- **Animación de entrada**: añade la clase `reveal` (y opcional `reveal-delay-1..3`) a cualquier elemento.
- **Isla interactiva**: crea un `.tsx` en `components/islands/` y úsalo desde un `.astro` con `client:visible` (o `client:load` si está en la primera pantalla, como el menú).

## Deploy en Cloudflare Pages

Salida 100% estática, sin adapter ni servidor:

1. Sube el repo a GitHub.
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Configura:
   - **Framework preset**: `Astro`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Node**: lo toma de `.nvmrc` (22.12.0); si no, añade variable `NODE_VERSION = 22.12.0`.
4. **Save and Deploy**. Cada push redespliega.
