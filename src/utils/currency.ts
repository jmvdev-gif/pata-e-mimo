import { BRAND_CONFIG } from '../config/brand';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function applySubscriptionDiscount(
  price: number,
  rate = BRAND_CONFIG.subscriptionDiscountRate,
): number {
  return roundCurrency(price * (1 - rate));
}
