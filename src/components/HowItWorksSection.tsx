import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, ShoppingBag, Truck } from 'lucide-react';

const STEPS = [
  {
    icon: ShoppingBag,
    title: 'Monte a sacola',
    text: 'Escolha no catálogo, monte um kit sob medida ou calcule quanto a ração dura.',
  },
  {
    icon: MessageCircle,
    title: 'Envie pelo WhatsApp',
    text: 'O pedido vai com itens e total já escritos. A loja confirma estoque, entrega e horário.',
  },
  {
    icon: Truck,
    title: 'Receba ou retire',
    text: 'Entrega no bairro ou retirada na loja. Você paga na hora: Pix, cartão ou dinheiro.',
  },
];

export function HowItWorksSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="como-funciona" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="text-xs font-medium tracking-[0.16em] text-ink-muted uppercase">Como funciona</p>
        <h2 className="mt-2 max-w-xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
          Do carrinho ao portão em três passos
        </h2>

        <ol className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.title}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : index * 0.08 }}
              className="flex gap-4 rounded-2xl border border-border bg-canvas p-5 sm:flex-col sm:p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage text-white">
                <step.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium text-ink-muted tabular-nums">Passo {index + 1}</p>
                <h3 className="mt-0.5 text-base font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
