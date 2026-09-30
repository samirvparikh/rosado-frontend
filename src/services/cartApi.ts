import { apiPost } from "./http";
import type { AddReadyMadeInput, CustomPerfumeCartItem, CustomPerfumePayload, ReadyMadeCartItem } from "@/types";

export async function priceReadyMade(input: AddReadyMadeInput): Promise<ReadyMadeCartItem> {
  return apiPost<ReadyMadeCartItem>("/cart/price-ready-made", input);
}

/**
 * `image` is accepted for backward-compat call sites but ignored -- the
 * backend derives the canonical image from the selected bottle so the
 * frontend can never spoof what a custom line shows in the cart/order.
 */
export async function priceCustomLine(
  payload: CustomPerfumePayload,
  _image?: string,
): Promise<CustomPerfumeCartItem> {
  return apiPost<CustomPerfumeCartItem>("/cart/price-custom", payload);
}
