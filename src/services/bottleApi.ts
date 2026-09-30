import { apiGet } from "./http";
import type { Bottle } from "@/types";

export async function getBottlesBySize(sizeId: string): Promise<Bottle[]> {
  return apiGet<Bottle[]>("/bottles", { size: sizeId });
}
