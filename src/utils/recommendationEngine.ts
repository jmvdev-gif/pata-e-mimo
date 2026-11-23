import { PRODUCTS } from '../data/products';
import type { PetGoal, Product, QuizAnswers, QuizRecommendation } from '../types/pet';
import { applySubscriptionDiscount, roundCurrency } from './currency';

const GOAL_LABEL: Record<PetGoal, string> = {
  nutrition_coat: 'nutrição e brilho da pelagem',
  weight_control: 'controle leve de peso',
  botanical_hygiene: 'cuidado diário e higiene suave',
  comfort_routine: 'conforto e rotina tranquila',
};

function scoreProduct(product: Product, answers: QuizAnswers): number {
  let score = 0;

  if (product.goals.includes(answers.goal)) score += 4;
  if (product.sizes.includes(answers.size)) score += 2;
  if (product.ages.includes(answers.age)) score += 2;
  if (product.species.length === 1 && product.species[0] === answers.species) score += 2;

  return score;
}

export function buildPetRecommendation(
  answers: QuizAnswers,
  catalog: Product[] = PRODUCTS,
): QuizRecommendation {
  const compatible = catalog.filter((item) => item.species.includes(answers.species));

  const ranked = [...compatible].sort((a, b) => {
    const scoreDiff = scoreProduct(b, answers) - scoreProduct(a, answers);
    if (scoreDiff !== 0) return scoreDiff;
    return a.price - b.price;
  });

  const selected: Product[] = [];

  // Ensure the kit always leads with the highest-scoring ration
  const topRation = ranked.find((item) => item.category === 'racoes');
  if (topRation) {
    selected.push(topRation);
  }

  // Prefer diversity across categories (cuidados + conforto)
  const desiredCategories: Product['category'][] = ['cuidados', 'conforto'];
  for (const cat of desiredCategories) {
    if (selected.length >= 3) break;
    const match = ranked.find(
      (item) => item.category === cat && !selected.some((picked) => picked.id === item.id),
    );
    if (match) {
      selected.push(match);
    }
  }

  // Fill up to 3 items if needed
  for (const item of ranked) {
    if (selected.length >= 3) break;
    if (!selected.some((picked) => picked.id === item.id)) {
      selected.push(item);
    }
  }

  const regularTotal = roundCurrency(
    selected.reduce((sum, item) => sum + item.price, 0),
  );
  const isSubscription = answers.purchasePreference === 'subscription';
  const finalTotal = isSubscription
    ? roundCurrency(
        selected.reduce((sum, item) => sum + applySubscriptionDiscount(item.price), 0),
      )
    : regularTotal;
  const savingsTotal = roundCurrency(regularTotal - finalTotal);

  const trimmedName = answers.petName.trim();
  const petSubject = trimmedName
    ? trimmedName
    : answers.species === 'dog'
      ? 'seu cão'
      : 'seu gato';

  const rationale = `Selecionamos 3 itens botânicos com foco em ${GOAL_LABEL[answers.goal]} para a rotina de ${petSubject}.`;

  return {
    products: selected,
    rationale,
    regularTotal,
    finalTotal,
    savingsTotal,
    isSubscription,
  };
}
