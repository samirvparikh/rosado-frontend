import { apiGet } from "./http";
import type { FragranceWithNotes } from "@/types";

/**
 * getFragranceBasePrice is called synchronously from render paths (builder
 * price previews) that can't await a network call. We cache the last
 * successful getFragrances()/getFragranceById() response -- exactly like the
 * old mock's always-in-memory array -- and read from that cache.
 */
let cache: FragranceWithNotes[] = [];

export async function getFragrances(): Promise<FragranceWithNotes[]> {
  const fragrances = await apiGet<FragranceWithNotes[]>("/fragrances");
  cache = fragrances;
  return fragrances;
}

export async function getFragranceById(id: string): Promise<FragranceWithNotes | null> {
  const fragrance = await apiGet<FragranceWithNotes | null>(`/fragrances/${id}`);
  if (fragrance) {
    cache = [...cache.filter((item) => item.id !== fragrance.id), fragrance];
  }
  return fragrance;
}

export function getFragranceBasePrice(fragranceId: string, sizeId: string): number {
  const fragrance = cache.find((item) => item.id === fragranceId);
  return fragrance?.sizePrices.find((row) => row.sizeId === sizeId)?.basePrice ?? 0;
}
