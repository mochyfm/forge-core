/**
 * Esquema de configuración de sitio del núcleo.
 *
 * En cada landing (paquete consumidor) defines TU config con `defineSite({...})`
 * y se la pasas a <Base>, <Header>, <Footer> por props. El núcleo no hardcodea
 * marca: todo entra por aquí.
 */
export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  lang: string;
  /** URL pública para canonical/Open Graph. */
  url: string;
  nav: { label: string; href: string }[];
  cta: { label: string; href: string };
  contact: { email: string; phone: string; address: string };
  social?: { instagram?: string; twitter?: string; facebook?: string };
}

export type NavItem = SiteConfig["nav"][number];

/** Helper identidad: da autocompletado y validación de tipos al definir la config. */
export function defineSite(config: SiteConfig): SiteConfig {
  return config;
}

/** Config de ejemplo usada por el playground del propio núcleo. */
export const exampleSite: SiteConfig = defineSite({
  name: "Astro Forge",
  tagline: "Plantilla base para landings",
  description:
    "Núcleo compartido en Astro + Tailwind + islas Preact. Clónalo vía paquete privado y publica en Cloudflare Pages.",
  lang: "es",
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
});
