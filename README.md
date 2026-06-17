# @mochyfm/forge-core

La base común de mis landings. En lugar de que cada web arrastre su propio
layout, su `<head>`, sus animaciones y su tema —y acabar copiando y pegando los
mismos arreglos una y otra vez— está todo aquí dentro. Cada landing instala este
paquete y se queda solo con lo suyo: su contenido, su marca y sus secciones.

La gracia está justo en eso: si toco algo del núcleo (un meta de SEO, una
animación, el favicon), lo publico y con un `pnpm update` se actualizan todas
las webs a la vez, sin ir web por web repitiendo el cambio.

## Cómo está montado

Todo es **Astro**, así que las landings salen como HTML estático y **sin
JavaScript** salvo en lo que de verdad tiene que ser interactivo. Y eso
interactivo son **islas de Preact** (`client:visible` y compañía): el menú
móvil, una calculadora de precios, una zona de subida de archivos… lo que haga
falta en cada caso. El resto, cero JS.

El tema va con **Tailwind v4** y tokens (`@theme`). Aquí hay un detalle
importante: el núcleo **no** importa Tailwind a propósito. De eso se encarga la
landing, que en su CSS hace:

```css
@import "tailwindcss";
@import "@mochyfm/forge-core/styles.css";
```

El `styles.css` del núcleo trae los tokens de marca, las animaciones y un par de
`@source` para que Tailwind escanee también los componentes del paquete. Las
rutas de esos `@source` son relativas al propio archivo, así que funcionan igual
tanto en local como ya instalado dentro de `node_modules`.

## Por qué se instala por git y no por npm

Al principio quería un paquete privado en GitHub Packages, pero el token que
tenía no llevaba permiso de `write:packages` y no me apetecía pelearme con eso.
Como en el núcleo no hay nada secreto, lo dejé en un **repo público** y cada
landing lo instala como **dependencia de git**:

```json
"dependencies": {
  "@mochyfm/forge-core": "github:mochyfm/forge-core"
}
```

De paso me ahorré un problema: Cloudflare lo clona sin token, sin `.npmrc` ni
nada raro de por medio. Funciona y a otra cosa.

## Qué hay dentro

- `styles.css` — los tokens del tema y las animaciones.
- `config` — `defineSite()` para declarar la marca (nombre, navegación,
  contacto, redes…) con tipos, y el tipo `SiteConfig`.
- `lib/seo` — `buildLocalBusiness()`, que te devuelve el JSON-LD: una
  `Organization` y una ficha `LocalBusiness` por cada sede que le pases.
- `layouts/Base.astro` — el `<head>` completo: title, meta, Open Graph, Twitter
  card, el JSON-LD que le enchufes, los favicons, las View Transitions y el
  script de animaciones. Sale con `noindex` por defecto (las landings nacen sin
  indexar a propósito); para que Google la vea, `SITE_INDEXABLE=true` en
  producción.
- `components/layout/{Header,Footer}.astro`
- `components/sections/*` — secciones de ejemplo (Hero, Features…).
- `components/islands/*` — las islas de Preact (p. ej. el menú móvil).

Nada va hardcodeado: a los componentes les pasas la config por props
(`site={site}`), de modo que cada landing mete su marca sin tener que tocar el
núcleo.

### Animaciones

Viven en el CSS y en un pequeño script del `Base`, y respetan
`prefers-reduced-motion` (si el usuario pide menos movimiento, se quedan
quietas):

- `.reveal` (con sus variantes `reveal-up`, `reveal-left`… y
  `reveal-delay-1..5`) para que las cosas aparezcan al hacer scroll, vía
  `IntersectionObserver`.
- `[data-countup]` para contar números hacia arriba.
- `[data-parallax]` para un parallax suave.

## Probar el núcleo por su cuenta

`src/pages/index.astro` es un playground que consume el propio paquete igual que
lo haría una landing de verdad, para ir viendo los cambios mientras desarrollas:

```bash
pnpm install
pnpm dev      # http://localhost:4321
```

## Arrancar una landing nueva

1. Una app Astro mínima con Preact y Tailwind:
   ```bash
   pnpm create astro@latest
   pnpm astro add preact
   # y @tailwindcss/vite para Tailwind v4
   ```
2. Añade el núcleo:
   ```bash
   pnpm add github:mochyfm/forge-core
   ```
3. En tu CSS global, importa Tailwind y el tema, y define tu marca:
   ```css
   @import "tailwindcss";
   @import "@mochyfm/forge-core/styles.css";

   @theme {
     /* aquí van los colores y tipografías de esta landing */
   }
   ```
4. Compón la página:
   ```astro
   ---
   import Base from "@mochyfm/forge-core/layouts/Base.astro";
   import Header from "@mochyfm/forge-core/components/layout/Header.astro";
   import { defineSite } from "@mochyfm/forge-core/config";

   const site = defineSite({ /* tu marca */ });
   ---
   <Base site={site}>
     <Header site={site} />
     ...
   </Base>
   ```

## Cuando toco el núcleo y quiero que llegue a todas las webs

1. Commit y push aquí, en el repo del núcleo.
2. En cada landing: `pnpm update @mochyfm/forge-core` y push. Cloudflare
   redespliega solo.

Sí, es manual, landing por landing. Es lo que hay y tampoco son tantas; a cambio
no tengo que acordarme de replicar el cambio a mano en cada sitio.

## Deploy de una landing en Cloudflare Pages

Preset **Astro**, build `pnpm build`, salida `dist` y Node 22.12.0 (lo fija el
`.nvmrc`). Como el paquete es público y se clona por git, no hace falta token ni
variables de entorno para instalarlo.
