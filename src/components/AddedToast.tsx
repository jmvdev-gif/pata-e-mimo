import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const TOAST_MS = 3200;

/** Aviso curto ao adicionar um produto, com atalho para abrir a sacola. */
export function AddedToast() {
  const { lastAdded, dismissAdded, isOpen, openCart } = useCart();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!lastAdded) return;
    const timer = window.setTimeout(dismissAdded, TOAST_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastAdded?.stamp]);

  const show = Boolean(lastAdded) && !isOpen;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 sm:bottom-8">
      <AnimatePresence>
        {show && lastAdded && (
          <motion.div
            key={lastAdded.stamp}
            role="status"
            aria-live="polite"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-ink py-3 pr-3 pl-4 text-sm text-white shadow-lg shadow-black/20"
          >
            <Check className="h-4 w-4 shrink-0 text-[#9FD3B4]" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate">
              <span className="font-medium">{lastAdded.name}</span> na sacola
            </span>
            <button
              type="button"
              onClick={() => {
                dismissAdded();
                openCart();
              }}
              className="shrink-0 cursor-pointer rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/20"
            >
              Ver sacola
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
