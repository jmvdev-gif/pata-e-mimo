import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { applySubscriptionDiscount, formatBRL } from '../utils/currency';
import { buildCartWhatsAppMessage } from '../utils/whatsapp';

interface CartDrawerProps {
  onCheckoutWhatsApp: (title: string, message: string) => void;
}

export function CartDrawer({ onCheckoutWhatsApp }: CartDrawerProps) {
  const prefersReducedMotion = useReducedMotion();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    toggleItemSubscription,
    regularSubtotal,
    discountTotal,
    finalTotal,
  } = useCart();

  const handleCheckout = () => {
    const message = buildCartWhatsAppMessage(items);
    closeCart();
    onCheckoutWhatsApp('Finalizar pedido no WhatsApp', message);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/35 backdrop-blur-[2px]"
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Sacola de compras"
            initial={prefersReducedMotion ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={prefersReducedMotion ? undefined : { x: '100%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-canvas"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="font-serif text-2xl font-medium text-ink">Sua sacola</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Fechar sacola"
                className="cursor-pointer rounded-full p-1.5 text-ink-muted transition-colors hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm text-ink-muted">
                    Sua sacola ainda está vazia.
                  </p>
                  <a
                    href="#produtos"
                    onClick={closeCart}
                    className="mt-4 inline-block text-sm font-medium text-sage underline underline-offset-4"
                  >
                    Ver produtos selecionados
                  </a>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => {
                    const effectiveUnit = item.isSubscription
                      ? applySubscriptionDiscount(item.unitPrice)
                      : item.unitPrice;
                    return (
                      <li key={item.key} className="py-4 first:pt-0">
                        <div className="flex gap-4">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-studio">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex flex-1 flex-col">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium text-ink">{item.name}</p>
                                <p className="text-xs text-ink-muted">{item.shortSpec}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeItem(item.key)}
                                aria-label={`Remover ${item.name}`}
                                className="cursor-pointer text-ink-muted hover:text-ink"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-2">
                              <div className="inline-flex items-center rounded-md border border-border bg-surface">
                                <button
                                  type="button"
                                  aria-label="Diminuir quantidade"
                                  onClick={() => updateQuantity(item.key, -1)}
                                  className="cursor-pointer px-2 py-1 text-ink-muted hover:text-ink"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="min-w-6 text-center text-xs font-medium text-ink tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  aria-label="Aumentar quantidade"
                                  onClick={() => updateQuantity(item.key, 1)}
                                  className="cursor-pointer px-2 py-1 text-ink-muted hover:text-ink"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <span className="text-sm font-semibold text-ink tabular-nums">
                                {formatBRL(effectiveUnit * item.quantity)}
                              </span>
                            </div>

                            <div className="mt-2.5 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => toggleItemSubscription(item.key)}
                                className={`cursor-pointer rounded px-2 py-0.5 text-[11px] font-medium transition-colors ${
                                  item.isSubscription
                                    ? 'bg-caramel-soft text-caramel-ink'
                                    : 'border border-border text-ink-muted hover:text-ink'
                                }`}
                              >
                                {item.isSubscription
                                  ? `Assinatura -15% (${item.frequencyDays ?? 30}d)`
                                  : 'Ativar -15% assinatura'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border bg-surface px-6 py-5">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between text-ink-muted">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{formatBRL(regularSubtotal)}</dd>
                  </div>
                  {discountTotal > 0 && (
                    <div className="flex justify-between text-caramel-ink">
                      <dt>Desconto assinatura (-15%)</dt>
                      <dd className="tabular-nums">-{formatBRL(discountTotal)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold text-ink">
                    <dt>Total</dt>
                    <dd className="tabular-nums">{formatBRL(finalTotal)}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-4 w-full cursor-pointer rounded-lg bg-sage px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-hover"
                >
                  Finalizar no WhatsApp
                </button>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
