import { create } from "zustand";
import { persist } from "zustand/middleware";
import { priceCustomLine, priceReadyMade } from "@/services/cartApi";
import type { AddReadyMadeInput, CartItem, CustomPerfumePayload } from "@/types";

interface CartState {
  items: CartItem[];
  addReadyMade: (input: AddReadyMadeInput) => Promise<void>;
  addCustom: (payload: CustomPerfumePayload, image: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

function mergeQuantity(items: CartItem[], next: CartItem): CartItem[] {
  const existing = items.find((item) => item.id === next.id);
  if (!existing) return [...items, next];
  return items.map((item) =>
    item.id === next.id
      ? {
          ...item,
          quantity: item.quantity + next.quantity,
          lineTotal: item.unitPrice * (item.quantity + next.quantity),
        }
      : item,
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addReadyMade: async (input) => {
        const priced = await priceReadyMade(input);
        set({ items: mergeQuantity(get().items, priced) });
      },
      addCustom: async (payload, image) => {
        const priced = await priceCustomLine(payload, image);
        set({ items: mergeQuantity(get().items, priced) });
      },
      updateQuantity: (id, quantity) =>
        set({
          items: get()
            .items.map((item) =>
              item.id === id
                ? { ...item, quantity, lineTotal: item.unitPrice * quantity }
                : item,
            )
            .filter((item) => item.quantity > 0),
        }),
      remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "rosado.cart" },
  ),
);

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.lineTotal, 0);
}
