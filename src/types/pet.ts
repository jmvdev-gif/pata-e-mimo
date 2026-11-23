export type PetSpecies = 'dog' | 'cat';
export type PetSize = 'small' | 'medium' | 'large';
export type PetAge = 'puppy' | 'adult' | 'senior';
export type PetGoal =
  | 'nutrition_coat'
  | 'weight_control'
  | 'botanical_hygiene'
  | 'comfort_routine';

export type ActivityLevel = 'calm' | 'moderate' | 'active';
export type ProductCategory = 'racoes' | 'cuidados' | 'conforto';
export type BagSizeKg = 3 | 10.1 | 15;
export type PurchasePreference = 'once' | 'subscription';

export interface Product {
  id: string;
  name: string;
  shortSpec: string;
  description: string;
  category: ProductCategory;
  species: PetSpecies[];
  sizes: PetSize[];
  ages: PetAge[];
  goals: PetGoal[];
  price: number;
  image: string;
  bagWeightKg?: BagSizeKg;
  rationVariants?: Record<BagSizeKg, number>;
}

export interface CartItem {
  key: string;
  productId: string;
  name: string;
  shortSpec: string;
  image: string;
  unitPrice: number;
  quantity: number;
  isSubscription: boolean;
  frequencyDays?: number;
  bagWeightKg?: BagSizeKg;
}

export interface QuizAnswers {
  petName: string;
  species: PetSpecies;
  size: PetSize;
  age: PetAge;
  goal: PetGoal;
  purchasePreference: PurchasePreference;
}

export interface QuizRecommendation {
  products: Product[];
  rationale: string;
  regularTotal: number;
  finalTotal: number;
  savingsTotal: number;
  isSubscription: boolean;
}

export interface RationInput {
  species: PetSpecies;
  weightKg: number;
  activityLevel: ActivityLevel;
  petCount: number;
  bagSizeKg: BagSizeKg;
}

export interface RationResult {
  dailyGramsPerPet: number;
  totalDailyGrams: number;
  durationDays: number;
  recommendedCadenceDays: number;
  nextDeliveryDate: string;
  matchedProduct: Product;
  regularBagPrice: number;
  subscriptionBagPrice: number;
  savingsPerBag: number;
  annualSavings: number;
}
