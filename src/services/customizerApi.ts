import { apiGet } from "./http";
import type { CustomizerData } from "@/types";

/** Omit `product` (id or slug) for the default custom perfume. */
export async function getCustomizer(product?: string): Promise<CustomizerData> {
  return apiGet<CustomizerData>(product ? `/perfume-customizer/${encodeURIComponent(product)}` : "/perfume-customizer");
}
