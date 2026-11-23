import { useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { ProductCard } from './ProductCard';

type FilterKey = 'all' | 'dog' | 'cat' | 'racoes' | 'cuidados' | 'conforto';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'dog', label: 'Cães' },
  { key: 'cat', label: 'Gatos' },
  { key: 'racoes', label: 'Rações' },
  { key: 'cuidados', label: 'Cuidados' },
  { key: 'conforto', label: 'Conforto' },
];

export function CatalogSection() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'dog' || activeFilter === 'cat') {
        return product.species.includes(activeFilter);
      }
      return product.category === activeFilter;
    });
  }, [activeFilter]);

  return (
    <section id="produtos" className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="flex flex-col justify-between gap-6 border-b border-border pb-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-ink-muted uppercase">
            Catálogo Essencial
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Produtos selecionados
          </h2>
        </div>

        <div
          className="flex flex-wrap items-center gap-x-5 gap-y-2"
          role="tablist"
          aria-label="Filtrar produtos"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(filter.key)}
                className={`cursor-pointer border-b-2 pb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-sage text-ink'
                    : 'border-transparent text-ink-muted hover:text-ink'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
