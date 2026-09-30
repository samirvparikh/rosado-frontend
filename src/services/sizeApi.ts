import { apiGet } from "./http";
import type { Size } from "@/types";

export async function getSizes(): Promise<Size[]> {
  return apiGet<Size[]>("/sizes");
}
