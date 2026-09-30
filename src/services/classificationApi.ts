import { apiGet } from "./http";
import type { ClassificationItem } from "@/types";

export interface ShopFilters {
  audiences: ClassificationItem[];
  fragranceFamilies: ClassificationItem[];
  occasions: ClassificationItem[];
  seasons: ClassificationItem[];
  timesOfDay: ClassificationItem[];
  intensities: ClassificationItem[];
  collections: ClassificationItem[];
}

let cached: Promise<ShopFilters> | null = null;

/** Classification masters rarely change within a session -- fetch once, reuse everywhere. */
export function getShopFilters(): Promise<ShopFilters> {
  if (!cached) {
    cached = apiGet<ShopFilters>("/shop-filters").catch((error) => {
      cached = null;
      throw error;
    });
  }
  return cached;
}
