/**
 * Configuración central del sitio.
 *
 * Al clonar una landing, edita ESTE archivo + los tokens de `styles/global.css`
 * + el contenido de las secciones. Nada de datos de marca hardcodeados fuera de aquí.
 */
export const site = {
  name: "Astro Forge",
  tagline: "Plantilla base para landings",
  description:
    "Esqueleto de landing en Astro + Tailwind + islas Preact. Clónalo, edita la config y el tema, y publica en Cloudflare Pages.",
  lang: "es",
  // URL pública (para metadatos Open Graph / canonical). Cámbiala en cada clon.
  url: "https://example.com",

  nav: [
    { label: "Inicio", href: "#inicio" },
    { label: "Características", href: "#caracteristicas" },
    { label: "Contacto", href: "#contacto" },
  ],

  cta: { label: "Empezar", href: "#contacto" },

  contact: {
    email: "hola@example.com",
    phone: "+34 600 000 000",
    address: "Tu dirección, Ciudad",
  },

  social: {
    instagram: "",
    twitter: "",
    facebook: "",
  },
} as const;

export type Site = typeof site;
export type NavItem = (typeof site.nav)[number];
