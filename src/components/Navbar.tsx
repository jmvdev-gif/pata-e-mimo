import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { BRAND_CONFIG } from '../config/brand';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Produtos', href: '#produtos' },
  { label: 'Sob Medida', href: '#sob-medida' },
  { label: 'Calculadora', href: '#calculadora' },
];

export function Navbar() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || mobileMenuOpen
          ? 'border-b border-border bg-canvas/95 text-ink backdrop-blur-md'
          : 'border-b border-transparent bg-transparent text-white'
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:h-16 sm:px-8">
        <a
          href="#inicio"
          className="font-serif text-2xl font-medium tracking-tight transition-opacity hover:opacity-80"
        >
          {BRAND_CONFIG.petStoreName}
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium opacity-85 transition-opacity hover:opacity-100"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Abrir sacola com ${itemCount} itens`}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              scrolled || mobileMenuOpen
                ? 'border-border bg-surface text-ink hover:border-sage'
                : 'border-white/35 bg-black/15 text-white backdrop-blur-xs hover:bg-black/30'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Sacola</span>
            {itemCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sage px-1.5 text-xs font-semibold text-white tabular-nums">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Menu móvel"
          className="border-t border-border bg-canvas px-5 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-base font-medium text-ink"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
