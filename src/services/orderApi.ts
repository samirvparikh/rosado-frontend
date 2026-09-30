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

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return apiPost<Order>("/orders", input);
}

export async function getOrders(): Promise<Order[]> {
  return apiGet<Order[]>("/orders");
}

export async function getOrderById(id: string): Promise<Order | null> {
  return apiGet<Order | null>(`/orders/${id}`);
}
