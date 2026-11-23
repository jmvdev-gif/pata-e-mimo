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
    <article className="flex flex-col rounded-xl border border-border bg-surface p-4 transition-colors hover:border-[#C7CCC3]">
      <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-studio">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="text-base font-medium text-ink">{product.name}</h3>
        <p className="mt-0.5 text-sm text-ink-muted">{product.shortSpec}</p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-base font-semibold text-ink tabular-nums">
            {formatBRL(product.price)}
          </span>
          <span className="rounded bg-caramel-soft px-2 py-0.5 text-[11px] font-medium text-caramel-ink">
            -15% assinatura
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-sage px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-hover"
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
