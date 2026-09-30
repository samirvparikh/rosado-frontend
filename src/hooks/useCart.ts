import { cartCount, cartSubtotal, useCartStore } from "@/store/cartStore";

export function useCart() {
  const items = useCartStore((state) => state.items);
  const addReadyMade = useCartStore((state) => state.addReadyMade);
  const addCustom = useCartStore((state) => state.addCustom);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);

  return {
    items,
    count: cartCount(items),
    subtotal: cartSubtotal(items),
    addReadyMade,
    addCustom,
    updateQuantity,
    remove,
    clear,
  };
}
