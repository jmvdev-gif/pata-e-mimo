import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { HeroVideoBackground } from './HeroVideoBackground';

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.12,
        delayChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="inicio"
      className="relative flex h-dvh min-h-[580px] max-h-[1080px] w-full flex-col justify-between overflow-hidden"
    >
      <HeroVideoBackground />

      {/* Top clearance for fixed navbar */}
      <div className="h-14 shrink-0 sm:h-16" aria-hidden="true" />

      {/* Main animated headline & CTA block centered vertically in left/lower safe space */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 items-end px-5 pb-8 sm:items-center sm:px-8 sm:pb-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl"
        >
          <motion.p
            variants={itemVariants}
            className="mb-3 text-xs font-medium tracking-[0.2em] text-white/80 uppercase sm:mb-4"
          >
            Pet shop de bairro com entrega
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-serif text-[clamp(2.55rem,7vw,5rem)] leading-[1.02] font-medium tracking-tight text-white"
          >
            Bem-estar natural diário
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base"
          >
            Ração, petiscos e cuidados para cães e gatos. Monte a sacola, envie o
            pedido pelo WhatsApp e receba em casa ou retire na loja.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8"
          >
            <a
              href="#produtos"
              className="inline-flex items-center gap-2 rounded-lg bg-sage px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-hover sm:px-6 sm:py-3.5"
            >
              <span>Ver produtos</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#sob-medida"
              className="inline-flex items-center rounded-lg border border-white/45 bg-black/20 px-5 py-3 text-sm font-medium text-white backdrop-blur-xs transition-colors hover:bg-white/15 sm:px-6 sm:py-3.5"
            >
              Montar kit sob medida
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Minimalist scroll indicator fitting cleanly inside 100dvh */}
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 pb-5 sm:px-8 sm:pb-7"
      >
        <a
          href="#como-funciona"
          className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-white/80 transition-colors hover:text-white"
        >
          <span>Como funciona</span>
          <motion.span
            animate={prefersReducedMotion ? undefined : { y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="inline-flex"
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </a>
      </motion.div>
    </section>
  );
}
