import { useState } from "preact/hooks";

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  items: readonly NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * Isla Preact: menú de navegación móvil (hamburguesa + panel).
 * Úsala con `client:load` o `client:visible` desde un .astro.
 * Es solo un ejemplo del patrón de isla; clónala/edítala según la landing.
 */
export default function MobileMenu({ items, ctaLabel, ctaHref }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div class="md:hidden">
      <button
        type="button"
        aria-label="Abrir menú"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        class="inline-flex items-center justify-center rounded-md p-2 text-ink hover:bg-black/5 transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div class="absolute left-0 right-0 top-full border-t border-black/10 bg-white shadow-lg animate-[fade-up_0.25s_ease-out]">
          <nav class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                class="rounded-md px-3 py-2 text-base font-medium text-ink hover:bg-black/5"
              >
                {item.label}
              </a>
            ))}
            {ctaLabel && ctaHref && (
              <a
                href={ctaHref}
                onClick={() => setOpen(false)}
                class="mt-2 rounded-md bg-brand px-3 py-2.5 text-center font-semibold text-white hover:bg-brand-dark transition"
              >
                {ctaLabel}
              </a>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
