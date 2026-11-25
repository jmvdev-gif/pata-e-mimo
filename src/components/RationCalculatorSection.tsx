import { useMemo, useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { ActivityLevel, BagSizeKg, PetSpecies, RationInput } from '../types/pet';
import { formatBRL } from '../utils/currency';
import { calculateRationPlan } from '../utils/rationCalculator';
import { buildRationWhatsAppMessage } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';

interface RationCalculatorSectionProps {
  onOpenWhatsApp: (title: string, message: string) => void;
}

const BAG_SIZES: { value: BagSizeKg; label: string }[] = [
  { value: 3, label: '3 kg' },
  { value: 10.1, label: '10,1 kg' },
  { value: 15, label: '15 kg' },
];

export function RationCalculatorSection({
  onOpenWhatsApp,
}: RationCalculatorSectionProps) {
  const { addItem, openCart } = useCart();

  const [input, setInput] = useState<RationInput>({
    species: 'dog',
    weightKg: 18,
    activityLevel: 'moderate',
    petCount: 1,
    bagSizeKg: 15,
  });

  const maxWeight = input.species === 'dog' ? 60 : 12;

  const result = useMemo(() => calculateRationPlan(input), [input]);

  const handleSpeciesChange = (species: PetSpecies) => {
    setInput((prev) => ({
      ...prev,
      species,
      weightKg: species === 'dog' ? 18 : 4,
      bagSizeKg: species === 'dog' ? 15 : 3,
    }));
  };

  const handleSubscribe = () => {
    const bagLabel = input.bagSizeKg === 10.1 ? '10,1 kg' : `${input.bagSizeKg} kg`;
    addItem(result.matchedProduct, {
      isSubscription: true,
      frequencyDays: result.recommendedCadenceDays,
      bagWeightKg: input.bagSizeKg,
      overridePrice: result.regularBagPrice,
      overrideSpec: `${bagLabel} • Reposição programada`,
    });
    openCart();
  };

  const handleWhatsAppReminder = () => {
    const message = buildRationWhatsAppMessage(input, result);
    onOpenWhatsApp('Lembrete de reposição no WhatsApp', message);
  };

  const chipClass = (active: boolean) =>
    `cursor-pointer rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? 'border-sage bg-sage text-white'
        : 'border-border bg-canvas text-ink hover:border-[#B9C1B8]'
    }`;

  return (
    <section id="calculadora" className="border-t border-border py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-10">
          <p className="text-xs font-medium tracking-[0.16em] text-ink-muted uppercase">
            Compra programada
          </p>
          <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Calculadora de ração e recompra
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink-muted sm:text-base">
            Descubra quanto tempo o pacote dura para o seu pet e programe a reposição:
            a loja te chama no WhatsApp antes da ração acabar, com 15% de desconto.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-7 rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="block text-sm font-medium text-ink">Espécie</span>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleSpeciesChange('dog')}
                    className={chipClass(input.species === 'dog')}
                  >
                    Cão
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSpeciesChange('cat')}
                    className={chipClass(input.species === 'cat')}
                  >
                    Gato
                  </button>
                </div>
              </div>

              <div>
                <span className="block text-sm font-medium text-ink">
                  Quantidade de pets
                </span>
                <div className="mt-2 inline-flex items-center rounded-lg border border-border bg-canvas">
                  <button
                    type="button"
                    aria-label="Diminuir quantidade de pets"
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        petCount: Math.max(1, prev.petCount - 1),
                      }))
                    }
                    className="cursor-pointer px-3 py-2 text-ink-muted hover:text-ink"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold text-ink tabular-nums">
                    {input.petCount}
                  </span>
                  <button
                    type="button"
                    aria-label="Aumentar quantidade de pets"
                    onClick={() =>
                      setInput((prev) => ({
                        ...prev,
                        petCount: Math.min(5, prev.petCount + 1),
                      }))
                    }
                    className="cursor-pointer px-3 py-2 text-ink-muted hover:text-ink"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="weight-slider" className="text-sm font-medium text-ink">
                  Peso médio por pet
                </label>
                <span className="text-sm font-semibold text-ink tabular-nums">
                  {input.weightKg} kg
                </span>
              </div>
              <input
                id="weight-slider"
                type="range"
                min={1}
                max={maxWeight}
                step={1}
                value={input.weightKg}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, weightKg: Number(e.target.value) }))
                }
                className="sage-slider mt-3"
              />
              <div className="mt-1.5 flex justify-between text-xs text-ink-muted tabular-nums">
                <span>1 kg</span>
                <span>{maxWeight} kg</span>
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-ink">Nível de atividade</span>
              <div className="mt-2 grid grid-cols-3 gap-2.5">
                {(
                  [
                    { id: 'calm', label: 'Calmo' },
                    { id: 'moderate', label: 'Moderado' },
                    { id: 'active', label: 'Ativo' },
                  ] as { id: ActivityLevel; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setInput((prev) => ({ ...prev, activityLevel: opt.id }))
                    }
                    className={chipClass(input.activityLevel === opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-ink">Tamanho do pacote</span>
              <div className="mt-2 grid grid-cols-3 gap-2.5">
                {BAG_SIZES.map((bag) => (
                  <button
                    key={bag.value}
                    type="button"
                    onClick={() =>
                      setInput((prev) => ({ ...prev, bagSizeKg: bag.value }))
                    }
                    className={chipClass(input.bagSizeKg === bag.value)}
                  >
                    {bag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary Column */}
          <div className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center gap-4 border-b border-border pb-5">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-studio">
                  <img
                    src={result.matchedProduct.image}
                    alt={result.matchedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">
                    {result.matchedProduct.name}
                  </p>
                  <p className="text-xs text-ink-muted">
                    Pacote de {input.bagSizeKg === 10.1 ? '10,1 kg' : `${input.bagSizeKg} kg`}
                  </p>
                </div>
              </div>

              <div className="py-6">
                <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                  Duração estimada do pacote
                </p>
                <p className="mt-1 font-serif text-5xl font-medium text-ink tabular-nums">
                  {result.durationDays} dias
                </p>
              </div>

              <dl className="divide-y divide-border border-y border-border text-sm">
                <div className="flex items-center justify-between py-3">
                  <dt className="text-ink-muted">Consumo diário total</dt>
                  <dd className="font-medium text-ink tabular-nums">
                    {result.totalDailyGrams} g/dia
                  </dd>
                </div>
                <div className="flex items-center justify-between py-3">
                  <dt className="text-ink-muted">Lembrete de reposição</dt>
                  <dd className="font-medium text-ink tabular-nums">
                    A cada {result.recommendedCadenceDays} dias ({result.nextDeliveryDate})
                  </dd>
                </div>
                <div className="flex items-center justify-between py-3">
                  <dt className="text-ink-muted">Valor programado (-15%)</dt>
                  <dd className="font-semibold text-ink tabular-nums">
                    <span className="mr-2 text-xs font-normal text-ink-muted line-through">
                      {formatBRL(result.regularBagPrice)}
                    </span>
                    {formatBRL(result.subscriptionBagPrice)}
                  </dd>
                </div>
                <div className="flex items-center justify-between py-3">
                  <dt className="text-ink-muted">Economia estimada ao ano</dt>
                  <dd className="font-medium text-caramel-ink tabular-nums">
                    {formatBRL(result.annualSavings)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleSubscribe}
                className="w-full cursor-pointer rounded-lg bg-sage px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-sage-hover"
              >
                Programar compra na sacola
              </button>
              <button
                type="button"
                onClick={handleWhatsAppReminder}
                className="w-full cursor-pointer rounded-lg border border-border bg-canvas px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-sage"
              >
                Pedir lembrete no WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
