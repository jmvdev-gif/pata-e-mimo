import { BRAND_CONFIG } from '../config/brand';

const FOOTER_LINKS = [
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Produtos', href: '#produtos' },
  { label: 'Sob medida', href: '#sob-medida' },
  { label: 'Calculadora', href: '#calculadora' },
  { label: 'Loja e entrega', href: '#loja' },
];

export function ShowcaseFooter() {
  const { store, conceptNotice } = BRAND_CONFIG;

  return (
    <footer className="border-t border-border bg-canvas pt-12 pb-28 sm:pb-24">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-medium text-ink">{BRAND_CONFIG.petStoreName}</p>
          <p className="mt-1 text-sm text-ink-muted">{BRAND_CONFIG.tagline}</p>
        </div>

        <nav aria-label="Rodapé" className="flex flex-col gap-2 text-sm text-ink-muted">
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="w-fit transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="text-sm text-ink-muted">
          <p className="text-ink">
            {store.street} — {store.district}
          </p>
          <p>{store.city}</p>
          <p className="mt-2">WhatsApp {BRAND_CONFIG.whatsappDisplay}</p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-6xl px-5 sm:px-8">
        <p className="flex flex-col gap-1 border-t border-border pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:gap-2">
          <span className="w-fit rounded-full border border-border px-2.5 py-0.5 font-medium text-ink">
            {conceptNotice.label}
          </span>
          <span>{conceptNotice.text}</span>
        </p>
      </div>
    </footer>
  );
}
