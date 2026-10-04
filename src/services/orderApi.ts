import { apiGet, apiPost } from "./http";
import type { CartItem, CartTotals, CreateOrderInput, Order, ShippingMethod, ShippingMethodId } from "@/types";

let cachedShippingMethods: Promise<ShippingMethod[]> | null = null;

export function getShippingMethods(): Promise<ShippingMethod[]> {
  if (!cachedShippingMethods) {
    cachedShippingMethods = apiGet<ShippingMethod[]>("/shipping-methods").catch((error) => {
      cachedShippingMethods = null;
      throw error;
    });
  }
  return cachedShippingMethods;
}

export async function quoteCart(
  items: CartItem[],
  shippingMethod: ShippingMethodId,
  couponCode?: string,
): Promise<CartTotals> {
  return apiPost<CartTotals>("/cart/quote", { items, shippingMethod, couponCode });
}

/** `accessToken` lets whoever placed the order view it without signing in. */
export async function createOrder(input: CreateOrderInput): Promise<Order & { accessToken: string }> {
  return apiPost<Order & { accessToken: string }>("/orders", input);
}

export async function getOrders(): Promise<Order[]> {
  return apiGet<Order[]>("/orders");
}

/** Signed-in owners need no key; guests pass the order's access key. */
export async function getOrderById(id: string, accessToken?: string | null): Promise<Order | null> {
  return apiGet<Order | null>(`/orders/${id}`, accessToken ? { token: accessToken } : undefined);
}
