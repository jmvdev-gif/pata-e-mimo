import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { BagSizeKg, CartItem, Product } from '../types/pet';
import { applySubscriptionDiscount, roundCurrency } from '../utils/currency';

const STORAGE_KEY = 'pata_mimo_cart_v1';

interface AddItemOptions {
  isSubscription?: boolean;
  frequencyDays?: number;
  bagWeightKg?: BagSizeKg;
  overridePrice?: number;
  overrideSpec?: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, options?: AddItemOptions) => void;
  addKit: (products: Product[], isSubscription: boolean) => void;
  updateQuantity: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  toggleItemSubscription: (key: string) => void;
  clearCart: () => void;
  itemCount: number;
  regularSubtotal: number;
  discountTotal: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function makeKey(
  productId: string,
  isSubscription: boolean,
  bagWeightKg?: BagSizeKg,
  frequencyDays?: number,
): string {
  return `${productId}:${isSubscription ? 'sub' : 'once'}:${bagWeightKg ?? 'std'}:${frequencyDays ?? 0}`;
}

function loadInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors in restricted environments
    }
  }, [items]);

  const addItem = (product: Product, options: AddItemOptions = {}) => {
    const isSubscription = Boolean(options.isSubscription);
    const bagWeightKg = options.bagWeightKg ?? product.bagWeightKg;
    const frequencyDays = isSubscription ? (options.frequencyDays ?? 30) : undefined;
    const unitPrice = options.overridePrice ?? product.price;
    const shortSpec = options.overrideSpec ?? product.shortSpec;
    const key = makeKey(product.id, isSubscription, bagWeightKg, frequencyDays);

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          shortSpec,
          image: product.image,
          unitPrice,
          quantity: 1,
          isSubscription,
          frequencyDays,
          bagWeightKg,
        },
      ];
    });
  };

  const addKit = (products: Product[], isSubscription: boolean) => {
    setItems((prev) => {
      const next = [...prev];
      for (const product of products) {
        const frequencyDays = isSubscription ? 30 : undefined;
        const key = makeKey(product.id, isSubscription, product.bagWeightKg, frequencyDays);
        const existingIndex = next.findIndex((item) => item.key === key);
        if (existingIndex >= 0) {
          next[existingIndex] = {
            ...next[existingIndex],
            quantity: next[existingIndex].quantity + 1,
          };
        } else {
          next.push({
            key,
            productId: product.id,
            name: product.name,
            shortSpec: product.shortSpec,
            image: product.image,
            unitPrice: product.price,
            quantity: 1,
            isSubscription,
            frequencyDays,
            bagWeightKg: product.bagWeightKg,
          });
        }
      }
      return next;
    });
    setIsOpen(true);
  };

  const updateQuantity = (key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  };

  const toggleItemSubscription = (key: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.key === key);
      if (!target) return prev;

      const nextSub = !target.isSubscription;
      const nextFreq = nextSub ? (target.frequencyDays ?? 30) : undefined;
      const nextKey = makeKey(
        target.productId,
        nextSub,
        target.bagWeightKg,
        nextFreq,
      );

      const withoutTarget = prev.filter((item) => item.key !== key);
      const duplicate = withoutTarget.find((item) => item.key === nextKey);

      if (duplicate) {
        return withoutTarget.map((item) =>
          item.key === nextKey
            ? { ...item, quantity: item.quantity + target.quantity }
            : item,
        );
      }

      return [
        ...withoutTarget,
        {
          ...target,
          key: nextKey,
          isSubscription: nextSub,
          frequencyDays: nextFreq,
        },
      ];
    });
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const regularSubtotal = roundCurrency(
      items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    );
    const finalTotal = roundCurrency(
      items.reduce((sum, item) => {
        const effectiveUnit = item.isSubscription
          ? applySubscriptionDiscount(item.unitPrice)
          : item.unitPrice;
        return sum + effectiveUnit * item.quantity;
      }, 0),
    );
    const discountTotal = roundCurrency(regularSubtotal - finalTotal);

    return { itemCount, regularSubtotal, discountTotal, finalTotal };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        addKit,
        updateQuantity,
        removeItem,
        toggleItemSubscription,
        clearCart,
        ...totals,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
