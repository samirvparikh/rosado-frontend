import { apiGet } from "./http";
import type { Cap } from "@/types";

export async function getCaps(sizeId?: string): Promise<Cap[]> {
  return apiGet<Cap[]>("/caps", sizeId ? { size: sizeId } : undefined);
}
