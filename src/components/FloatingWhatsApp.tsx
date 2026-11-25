import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { buildContactWhatsAppMessage } from '../utils/whatsapp';

interface FloatingWhatsAppProps {
  onOpenWhatsApp: (title: string, message: string) => void;
}

/** Botão fixo de contato: aparece depois do topo e some com a sacola aberta. */
export function FloatingWhatsApp({ onOpenWhatsApp }: FloatingWhatsAppProps) {
  const { isOpen } = useCart();
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !isOpen && (
        <motion.button
          type="button"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
          onClick={() => onOpenWhatsApp('Falar com a loja', buildContactWhatsAppMessage())}
          aria-label="Falar com a loja pelo WhatsApp"
          className="fixed right-4 bottom-4 z-30 inline-flex cursor-pointer items-center gap-2 rounded-full bg-sage py-3 pr-4 pl-3.5 text-sm font-medium text-white shadow-lg shadow-black/15 transition-colors hover:bg-sage-hover sm:right-6 sm:bottom-6"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          <span className="hidden sm:inline">Falar com a loja</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
