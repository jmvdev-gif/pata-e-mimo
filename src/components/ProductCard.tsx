import { useState } from 'react';
import { Check } from 'lucide-react';
import type { Product } from '../types/pet';
import { formatBRL } from '../utils/currency';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-2.5 transition-colors hover:border-[#C7CCC3] sm:p-4">
      <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-studio sm:mb-4">
        <img
          src={product.image}
          alt={`${product.name} — ${product.shortSpec}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-sm leading-snug font-medium text-ink sm:text-base">{product.name}</h3>
        <p className="mt-0.5 text-xs text-ink-muted sm:text-sm">{product.shortSpec}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-2.5 sm:pt-3">
          <span className="text-sm font-semibold text-ink tabular-nums sm:text-base">
            {formatBRL(product.price)}
          </span>
          <span className="rounded bg-caramel-soft px-1.5 py-0.5 text-[10px] font-medium text-caramel-ink sm:px-2 sm:text-[11px]">
            -15% na programada
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-sage px-3 py-2 text-sm font-medium sm:mt-4 sm:px-4 sm:py-2.5 text-white transition-colors hover:bg-sage-hover"
        >
          {justAdded ? (
            <>
              <Check className="h-4 w-4" />
              <span>Adicionado</span>
            </>
          ) : (
            <span>Adicionar</span>
          )}
        </button>
      </div>
    </article>
  );
}
