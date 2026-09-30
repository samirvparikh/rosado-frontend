import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) => {
        const current = get().productIds;
        set({
          productIds: current.includes(productId)
            ? current.filter((id) => id !== productId)
            : [...current, productId],
        });
      },
      has: (productId) => get().productIds.includes(productId),
    }),
    { name: "rosado.wishlist" },
  ),
);
