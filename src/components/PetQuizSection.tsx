import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import type {
  PetAge,
  PetGoal,
  PetSize,
  PetSpecies,
  PurchasePreference,
  QuizAnswers,
} from '../types/pet';
import { applySubscriptionDiscount, formatBRL } from '../utils/currency';
import { buildPetRecommendation } from '../utils/recommendationEngine';
import { buildQuizWhatsAppMessage } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';

interface PetQuizSectionProps {
  onOpenWhatsApp: (title: string, message: string) => void;
}

const DEFAULT_ANSWERS: QuizAnswers = {
  petName: '',
  species: 'dog',
  size: 'medium',
  age: 'adult',
  goal: 'nutrition_coat',
  purchasePreference: 'subscription',
};

const TOTAL_STEPS = 4;

export function PetQuizSection({ onOpenWhatsApp }: PetQuizSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { addKit } = useCart();

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(DEFAULT_ANSWERS);
  const [completed, setCompleted] = useState(false);

  const recommendation = buildPetRecommendation(answers);
  const progressPercent = completed ? 100 : (step / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (completed) {
      setCompleted(false);
      setStep(TOTAL_STEPS);
    } else if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers(DEFAULT_ANSWERS);
    setStep(1);
    setCompleted(false);
  };

  const handleSendWhatsApp = () => {
    const message = buildQuizWhatsAppMessage(answers, recommendation);
    onOpenWhatsApp('Enviar kit recomendado no WhatsApp', message);
  };

  const optionClass = (active: boolean) =>
    `cursor-pointer rounded-xl border p-4 text-left transition-colors ${
      active
        ? 'border-sage bg-[#EFF3F0] text-ink'
        : 'border-border bg-surface text-ink hover:border-[#B9C1B8]'
    }`;

  return (
    <section id="sob-medida" className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="mb-10">
          <p className="text-xs font-medium tracking-[0.16em] text-ink-muted uppercase">
            Sob Medida
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Kit sob medida para o seu pet
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-muted sm:text-base">
            Responda 4 perguntas rápidas para montar uma combinação sob medida e
            gerar o pedido direto no WhatsApp.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
          {/* Minimalist 2px hairline progress bar */}
          <div className="mb-8">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-ink-muted">
              <span>{completed ? 'Resultado pronto' : `Etapa ${step} de ${TOTAL_STEPS}`}</span>
              <span className="tabular-nums">{Math.round(progressPercent)}%</span>
            </div>
            <div className="h-0.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className="h-full bg-sage transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key={`step-${step}`}
                initial={prefersReducedMotion ? false : { opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, x: -10 }}
                transition={{ duration: 0.22 }}
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-ink">
                        Qual é o seu pet e como ele se chama?
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted">
                        Usamos a espécie para filtrar fórmulas seguras.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {(
                        [
                          { id: 'dog', title: 'Cão', desc: 'Nutrição e rotina canina' },
                          { id: 'cat', title: 'Gato', desc: 'Fórmulas e cuidados felinos' },
                        ] as { id: PetSpecies; title: string; desc: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, species: opt.id }))}
                          className={optionClass(answers.species === opt.id)}
                        >
                          <span className="block text-base font-medium text-ink">
                            {opt.title}
                          </span>
                          <span className="mt-1 block text-xs text-ink-muted">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div>
                      <label
                        htmlFor="pet-name-input"
                        className="block text-sm font-medium text-ink"
                      >
                        Nome do pet (opcional)
                      </label>
                      <input
                        id="pet-name-input"
                        type="text"
                        maxLength={28}
                        value={answers.petName}
                        onChange={(e) =>
                          setAnswers((prev) => ({ ...prev, petName: e.target.value }))
                        }
                        placeholder="Ex.: Bento, Luna..."
                        className="mt-2 w-full rounded-lg border border-border bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-sage focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-ink">
                        Porte e fase de vida
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted">
                        Ajusta textura, tamanho de grão e ergonomia.
                      </p>
                    </div>

                    <div>
                      <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                        Porte
                      </span>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        {(
                          [
                            { id: 'small', label: 'Pequeno', sub: 'Até 10 kg' },
                            { id: 'medium', label: 'Médio', sub: '10 a 25 kg' },
                            { id: 'large', label: 'Grande', sub: 'Acima de 25 kg' },
                          ] as { id: PetSize; label: string; sub: string }[]
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, size: opt.id }))}
                            className={optionClass(answers.size === opt.id)}
                          >
                            <span className="block text-sm font-medium text-ink">
                              {opt.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-muted">
                              {opt.sub}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                        Fase de vida
                      </span>
                      <div className="mt-2 grid grid-cols-3 gap-3">
                        {(
                          [
                            { id: 'puppy', label: 'Filhote' },
                            { id: 'adult', label: 'Adulto' },
                            { id: 'senior', label: 'Sênior' },
                          ] as { id: PetAge; label: string }[]
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, age: opt.id }))}
                            className={optionClass(answers.age === opt.id)}
                          >
                            <span className="block text-sm font-medium text-ink">
                              {opt.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-ink">
                        Qual é a prioridade principal agora?
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted">
                        Define os itens complementares do kit recomendado.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(
                        [
                          {
                            id: 'nutrition_coat',
                            title: 'Pelagem e Nutrição',
                            desc: 'Ômega 3 e ingredientes botânicos',
                          },
                          {
                            id: 'weight_control',
                            title: 'Controle de Peso',
                            desc: 'Saciedade leve e gasto de energia',
                          },
                          {
                            id: 'botanical_hygiene',
                            title: 'Higiene Suave',
                            desc: 'Banho sem sulfatos e pele equilibrada',
                          },
                          {
                            id: 'comfort_routine',
                            title: 'Conforto e Rotina',
                            desc: 'Descanso ergonômico e alimentação limpa',
                          },
                        ] as { id: PetGoal; title: string; desc: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, goal: opt.id }))}
                          className={optionClass(answers.goal === opt.id)}
                        >
                          <span className="block text-sm font-medium text-ink">
                            {opt.title}
                          </span>
                          <span className="mt-1 block text-xs text-ink-muted">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-ink">
                        Como prefere receber o kit?
                      </h3>
                      <p className="mt-1 text-sm text-ink-muted">
                        Na compra programada, a loja te chama no WhatsApp na hora de repor, com 15% de desconto.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {(
                        [
                          {
                            id: 'subscription',
                            title: 'Compra programada',
                            desc: '15% de desconto • A loja avisa antes de cada reposição',
                          },
                          {
                            id: 'once',
                            title: 'Compra única',
                            desc: 'Experimente primeiro, sem compromisso',
                          },
                        ] as { id: PurchasePreference; title: string; desc: string }[]
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setAnswers((prev) => ({ ...prev, purchasePreference: opt.id }))
                          }
                          className={optionClass(answers.purchasePreference === opt.id)}
                        >
                          <span className="block text-base font-medium text-ink">
                            {opt.title}
                          </span>
                          <span className="mt-1 block text-xs text-ink-muted">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-35"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sage px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-hover"
                  >
                    <span>{step === TOTAL_STEPS ? 'Ver Kit Ideal' : 'Continuar'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
                      {answers.petName.trim()
                        ? `Kit selecionado para ${answers.petName.trim()}`
                        : 'Seu kit recomendado'}
                    </h3>
                    <p className="mt-1 text-sm text-ink-muted">{recommendation.rationale}</p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex cursor-pointer items-center gap-1.5 self-start text-xs font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Refazer</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {recommendation.products.map((product) => {
                    const effectivePrice = recommendation.isSubscription
                      ? applySubscriptionDiscount(product.price)
                      : product.price;
                    return (
                      <div
                        key={product.id}
                        className="rounded-xl border border-border bg-canvas p-3.5"
                      >
                        <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-studio">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-ink">{product.name}</p>
                        <p className="mt-0.5 text-xs text-ink-muted">{product.shortSpec}</p>
                        <p className="mt-2 text-sm font-semibold text-ink tabular-nums">
                          {formatBRL(effectivePrice)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-sm text-ink-muted">Total do kit:</span>
                      <span className="text-2xl font-semibold text-ink tabular-nums">
                        {formatBRL(recommendation.finalTotal)}
                      </span>
                      {recommendation.savingsTotal > 0 && (
                        <span className="rounded bg-caramel-soft px-2 py-0.5 text-xs font-medium text-caramel-ink">
                          Economia de {formatBRL(recommendation.savingsTotal)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        addKit(recommendation.products, recommendation.isSubscription)
                      }
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sage px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sage-hover"
                    >
                      <Check className="h-4 w-4" />
                      <span>Adicionar kit à sacola</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="cursor-pointer rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-sage"
                    >
                      Enviar no WhatsApp
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
