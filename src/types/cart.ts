import type { CustomPerfumeValidated } from "./customPerfume";
import type { PreviewSnapshot } from "./customizer";

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
  productId?: string | null;
  productName?: string;
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
  /** Layer stack for the cart thumbnail (display only -- the IDs are what get re-priced). */
  preview?: PreviewSnapshot | null;
  quantity: number;
  /** Product base price for the size. */
  basePrice: number;
  fragrancePrice?: number;
  bottlePrice: number;
  capPrice: number;
  /** fragrance + bottle + cap. */
  customizationPrice?: number;
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
