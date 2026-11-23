import { PRODUCTS } from '../data/products';
import type { ActivityLevel, Product, RationInput, RationResult } from '../types/pet';
import { applySubscriptionDiscount, roundCurrency } from './currency';

const DOG_ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  calm: 0.88,
  moderate: 1.0,
  active: 1.18,
};

const CAT_ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  calm: 0.9,
  moderate: 1.0,
  active: 1.15,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatDatePtBr(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function calculateRationPlan(
  input: RationInput,
  referenceDate: Date = new Date(),
  catalog: Product[] = PRODUCTS,
): RationResult {
  const maxWeight = input.species === 'dog' ? 65 : 15;
  const weightKg = clamp(input.weightKg, 1, maxWeight);
  const petCount = clamp(Math.round(input.petCount), 1, 5);

  const dailyGramsPerPet =
    input.species === 'dog'
      ? Math.round(32 * Math.pow(weightKg, 0.75) * DOG_ACTIVITY_FACTOR[input.activityLevel])
      : Math.round(14 * Math.pow(weightKg, 0.75) * CAT_ACTIVITY_FACTOR[input.activityLevel]);

  const totalDailyGrams = dailyGramsPerPet * petCount;
  const bagGrams = input.bagSizeKg * 1000;
  const durationDays = Math.max(1, Math.floor(bagGrams / totalDailyGrams));

  const recommendedCadenceDays =
    durationDays <= 10 ? Math.max(5, durationDays - 1) : Math.max(7, durationDays - 3);

  const nextDate = new Date(referenceDate.getTime());
  nextDate.setDate(nextDate.getDate() + recommendedCadenceDays);
  const nextDeliveryDate = formatDatePtBr(nextDate);

  const preferredProductId =
    input.species === 'dog' ? 'racao-botanica-caes' : 'racao-botanica-gatos';

  const matchedProduct =
    catalog.find((p) => p.id === preferredProductId) ??
    catalog.find((p) => p.category === 'racoes' && p.species.includes(input.species)) ??
    catalog[0];

  const regularBagPrice =
    matchedProduct.rationVariants?.[input.bagSizeKg] ?? matchedProduct.price;
  const subscriptionBagPrice = applySubscriptionDiscount(regularBagPrice);
  const savingsPerBag = roundCurrency(regularBagPrice - subscriptionBagPrice);
  const bagsPerYear = 365 / durationDays;
  const annualSavings = roundCurrency(savingsPerBag * bagsPerYear);

  return {
    dailyGramsPerPet,
    totalDailyGrams,
    durationDays,
    recommendedCadenceDays,
    nextDeliveryDate,
    matchedProduct,
    regularBagPrice,
    subscriptionBagPrice,
    savingsPerBag,
    annualSavings,
  };
}
