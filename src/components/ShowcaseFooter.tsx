import { BRAND_CONFIG } from '../config/brand';

export function ShowcaseFooter() {
  return (
    <footer id="vitrine" className="border-t border-border bg-canvas py-12">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="font-serif text-xl font-medium text-ink">
            {BRAND_CONFIG.petStoreName}
          </p>
          <p className="mt-1 text-sm text-ink-muted">{BRAND_CONFIG.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm text-ink-muted">
          <a href="#produtos" className="transition-colors hover:text-ink">
            Produtos
          </a>
          <a href="#sob-medida" className="transition-colors hover:text-ink">
            Sob Medida
          </a>
          <a href="#calculadora" className="transition-colors hover:text-ink">
            Calculadora
          </a>
        </div>

        {BRAND_CONFIG.agencyShowcase.enabled && (
          <p className="text-xs text-ink-muted">
            {BRAND_CONFIG.agencyShowcase.label} •{' '}
            <a
              href={BRAND_CONFIG.agencyShowcase.agencyUrl}
              className="font-medium text-ink underline underline-offset-4"
            >
              {BRAND_CONFIG.agencyShowcase.agencyName}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
