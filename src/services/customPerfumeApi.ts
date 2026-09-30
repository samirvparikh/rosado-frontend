import { apiPost } from "./http";
import type { CustomPerfumePayload, CustomPerfumeValidated } from "@/types";

export async function validateConfiguration(
  payload: CustomPerfumePayload,
): Promise<CustomPerfumeValidated> {
  return apiPost<CustomPerfumeValidated>("/custom-perfume/validate", payload);
}

export async function quoteConfiguration(payload: Omit<CustomPerfumePayload, "quantity">) {
  return apiPost<{ basePrice: number; bottlePrice: number; capPrice: number; totalPrice: number }>(
    "/custom-perfume/price",
    payload,
  );
}
