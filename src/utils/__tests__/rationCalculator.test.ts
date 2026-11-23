import { describe, expect, it } from 'vitest';
import { calculateRationPlan } from '../rationCalculator';

describe('calculateRationPlan', () => {
  const fixedDate = new Date(2026, 10, 19); // 19/11/2026

  it('calculates realistic daily intake, bag duration, and 15% subscription savings for a dog', () => {
    const result = calculateRationPlan(
      {
        species: 'dog',
        weightKg: 20,
        activityLevel: 'moderate',
        petCount: 1,
        bagSizeKg: 15,
      },
      fixedDate,
    );

    expect(result.dailyGramsPerPet).toBeGreaterThan(250);
    expect(result.dailyGramsPerPet).toBeLessThan(400);
    expect(result.totalDailyGrams).toBe(result.dailyGramsPerPet);
    expect(result.durationDays).toBe(Math.floor(15000 / result.totalDailyGrams));
    expect(result.recommendedCadenceDays).toBe(result.durationDays - 3);
    expect(result.matchedProduct.id).toBe('racao-botanica-caes');
    expect(result.regularBagPrice).toBe(189.9);
    expect(result.subscriptionBagPrice).toBeCloseTo(161.42, 2);
    expect(result.annualSavings).toBeGreaterThan(0);
    expect(result.nextDeliveryDate).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('scales total consumption linearly with petCount and supports 3kg / 10.1kg bags', () => {
    const singlePet = calculateRationPlan(
      {
        species: 'cat',
        weightKg: 4,
        activityLevel: 'calm',
        petCount: 1,
        bagSizeKg: 3,
      },
      fixedDate,
    );

    const twoPets = calculateRationPlan(
      {
        species: 'cat',
        weightKg: 4,
        activityLevel: 'calm',
        petCount: 2,
        bagSizeKg: 10.1,
      },
      fixedDate,
    );

    expect(twoPets.dailyGramsPerPet).toBe(singlePet.dailyGramsPerPet);
    expect(twoPets.totalDailyGrams).toBe(singlePet.dailyGramsPerPet * 2);
    expect(twoPets.matchedProduct.id).toBe('racao-botanica-gatos');
    expect(twoPets.regularBagPrice).toBe(249.9);
  });

  it('clamps extreme out-of-range weight and petCount safely', () => {
    const clamped = calculateRationPlan(
      {
        species: 'dog',
        weightKg: -5,
        activityLevel: 'active',
        petCount: 99,
        bagSizeKg: 15,
      },
      fixedDate,
    );

    expect(clamped.dailyGramsPerPet).toBeGreaterThan(0);
    expect(clamped.totalDailyGrams).toBe(clamped.dailyGramsPerPet * 5);
    expect(clamped.durationDays).toBeGreaterThanOrEqual(1);
  });
});
