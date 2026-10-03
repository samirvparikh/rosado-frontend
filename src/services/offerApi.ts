import { apiGet } from "./http";
import type { Offer } from "@/types";

/** Active homepage offer-header lines, managed in admin under Content > Offer Header. */
export async function getOffers(): Promise<Offer[]> {
  return apiGet<Offer[]>("/offers");
}
