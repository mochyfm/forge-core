import type { SiteConfig } from "../config/site";

/** Forma mínima de sede que necesita el structured data. */
export interface SeoBranch {
  id?: string;
  name: string;
  phone: string;
  address: string;
  lat?: number;
  lng?: number;
  hours?: string;
}

// "Lun - Sáb: 09:00 - 20:30" -> OpeningHoursSpecification (Lunes a Sábado).
function parseHours(hours?: string) {
  if (!hours) return undefined;
  const m = hours.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!m) return undefined;
  return [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: m[1],
      closes: m[2],
    },
  ];
}

/**
 * Construye JSON-LD para SEO local: una Organization (la marca) + una
 * entidad por sede (LocalBusiness, tipo configurable, p. ej. "HairSalon").
 * Pásalo a <Base schema={...}>.
 */
export function buildLocalBusiness(opts: {
  site: SiteConfig;
  branches?: SeoBranch[];
  /** Imagen/logo absoluta o ruta (se resuelve contra site.url). */
  image?: string;
  /** @type de cada sede (HairSalon, BarberShop, Restaurant…). */
  type?: string;
  priceRange?: string;
  /** locality/region/country por defecto para las direcciones. */
  addressRegion?: string;
  addressCountry?: string;
}) {
  const {
    site,
    branches = [],
    image,
    type = "LocalBusiness",
    priceRange = "€€",
    addressRegion,
    addressCountry = "ES",
  } = opts;

  const abs = (p?: string) => (p ? new URL(p, site.url).href : undefined);

  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}#org`,
    name: site.name,
    url: site.url,
    description: site.description,
    ...(image ? { logo: abs(image), image: abs(image) } : {}),
    ...(site.social
      ? { sameAs: Object.values(site.social).filter(Boolean) }
      : {}),
  };

  const places = branches.map((b) => ({
    "@context": "https://schema.org",
    "@type": type,
    name: `${site.name} — ${b.name}`,
    telephone: b.phone,
    url: site.url,
    priceRange,
    ...(image ? { image: abs(image) } : {}),
    parentOrganization: { "@id": `${site.url}#org` },
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address,
      ...(addressRegion ? { addressRegion } : {}),
      addressCountry,
    },
    ...(b.lat != null && b.lng != null
      ? { geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lng } }
      : {}),
    ...(parseHours(b.hours) ? { openingHoursSpecification: parseHours(b.hours) } : {}),
  }));

  return [org, ...places];
}
