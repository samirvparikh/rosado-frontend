import type { CartItem } from "./cart";

export type OrderStatus = "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type PaymentMethod = "COD" | "UPI" | "CARD";

export type ShippingMethodId = "standard" | "express";

export interface ShippingAddress {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItemSnapshot {
  productType: "READY_MADE" | "CUSTOM_PERFUME";
  productName: string;
  sizeName: string;
  fragranceName?: string;
  bottleName?: string;
  capName?: string;
  quantity: number;
  basePrice: number;
  bottlePrice: number;
  capPrice: number;
  discount: number;
  tax: number;
  finalPrice: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  customer: ShippingAddress;
  shippingMethod: ShippingMethodId;
  shippingMethodLabel: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  finalPrice: number;
}

export interface CreateOrderInput {
  customer: ShippingAddress;
  shippingMethod: ShippingMethodId;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  items: CartItem[];
}

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  description: string;
  price: number;
  eta: string;
}
