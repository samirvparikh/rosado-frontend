import { apiGet } from "./http";
import type { ProductOffer } from "@/types";

/** Live perfume-page tagline. Null when admin has set it inactive. */
export async function getProductOffer(): Promise<ProductOffer | null> {
  return apiGet<ProductOffer | null>("/product-offer");
}
