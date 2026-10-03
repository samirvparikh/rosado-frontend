import type { CustomPerfumeValidated } from "./customPerfume";

export type CartProductType = "READY_MADE" | "CUSTOM_PERFUME";

export interface ReadyMadeCartItem {
  id: string;
  productType: "READY_MADE";
  productId: string;
  productName: string;
  slug: string;
  image: string;
  sizeId: string;
  sizeName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CustomPerfumeCartItem {
  id: string;
  productType: "CUSTOM_PERFUME";
  fragranceId: string;
  fragranceName: string;
  sizeId: string;
  sizeName: string;
  bottleId: string;
  bottleName: string;
  capId: string;
  capName: string;
  remarks?: string | null;
  labelLine1?: string | null;
  labelLine2?: string | null;
  image: string;
  quantity: number;
  basePrice: number;
  bottlePrice: number;
  capPrice: number;
  unitPrice: number;
  lineTotal: number;
}

export type CartItem = ReadyMadeCartItem | CustomPerfumeCartItem;

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface AddReadyMadeInput {
  productId: string;
  sizeId: string;
  quantity: number;
}

export interface AddCustomInput extends CustomPerfumeValidated {
  image: string;
}
