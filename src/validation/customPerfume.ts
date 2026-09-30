import { bottles } from "@/data/mocks/bottles";
import { caps, capSizeMappings } from "@/data/mocks/caps";
import { fragranceSizePrices, fragrances } from "@/data/mocks/fragrances";
import { sizes } from "@/data/mocks/sizes";
import { getBottleInventoryState, getCapInventoryState } from "@/data/mocks/db";
import type { CustomPerfumePayload, CustomPerfumeValidated } from "@/types";

export interface ValidationFailure {
  ok: false;
  code:
    | "MISSING_FIELDS"
    | "UNKNOWN_ENTITY"
    | "BOTTLE_SIZE_MISMATCH"
    | "CAP_SIZE_MISMATCH"
    | "INACTIVE"
    | "OUT_OF_STOCK"
    | "INVALID_QUANTITY";
  message: string;
}

export interface ValidationSuccess {
  ok: true;
  data: CustomPerfumeValidated;
}

export type CustomPerfumeValidationResult = ValidationFailure | ValidationSuccess;

function getBasePrice(fragranceId: string, sizeId: string): number | null {
  const row = fragranceSizePrices.find(
    (item) => item.fragranceId === fragranceId && item.sizeId === sizeId,
  );
  return row ? row.basePrice : null;
}

export function validateCustomPerfume(
  payload: CustomPerfumePayload,
): CustomPerfumeValidationResult {
  const { fragranceId, sizeId, bottleId, capId, quantity } = payload;

  if (!fragranceId || !sizeId || !bottleId || !capId) {
    return { ok: false, code: "MISSING_FIELDS", message: "Complete the perfume configuration." };
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    return { ok: false, code: "INVALID_QUANTITY", message: "Quantity must be between 1 and 10." };
  }

  const size = sizes.find((item) => item.id === sizeId && item.status === "ACTIVE");
  const fragrance = fragrances.find((item) => item.id === fragranceId && item.status === "ACTIVE");
  const bottle = bottles.find((item) => item.id === bottleId);
  const cap = caps.find((item) => item.id === capId);

  if (!size || !fragrance || !bottle || !cap) {
    return { ok: false, code: "UNKNOWN_ENTITY", message: "This configuration is no longer available." };
  }

  if (bottle.status !== "ACTIVE" || cap.status !== "ACTIVE") {
    return { ok: false, code: "INACTIVE", message: "A selected component is unavailable." };
  }

  if (bottle.sizeId !== size.id) {
    return {
      ok: false,
      code: "BOTTLE_SIZE_MISMATCH",
      message: "Bottle is not compatible with the selected size.",
    };
  }

  const mappings = capSizeMappings.filter((item) => item.capId === cap.id && item.status === "ACTIVE");
  if (mappings.length > 0 && !mappings.some((item) => item.sizeId === size.id)) {
    return {
      ok: false,
      code: "CAP_SIZE_MISMATCH",
      message: "Cap is not compatible with the selected size.",
    };
  }

  const basePrice = getBasePrice(fragrance.id, size.id);
  if (basePrice === null) {
    return { ok: false, code: "UNKNOWN_ENTITY", message: "No price is defined for this size." };
  }

  const bottleInv = getBottleInventoryState().find((item) => item.bottleId === bottle.id);
  const capInv = getCapInventoryState().find((item) => item.capId === cap.id);
  const bottleAvailable = bottleInv?.availableStock ?? 0;
  const capAvailable = capInv?.availableStock ?? 0;

  if (bottleAvailable < quantity || capAvailable < quantity) {
    return { ok: false, code: "OUT_OF_STOCK", message: "A selected component is out of stock." };
  }

  const bottlePrice = bottle.additionalPrice;
  const capPrice = cap.additionalPrice;
  const unitPrice = basePrice + bottlePrice + capPrice;

  return {
    ok: true,
    data: {
      fragranceId: fragrance.id,
      fragranceName: fragrance.name,
      sizeId: size.id,
      sizeName: size.displayName,
      bottleId: bottle.id,
      bottleName: bottle.name,
      capId: cap.id,
      capName: cap.name,
      basePrice,
      bottlePrice,
      capPrice,
      unitPrice,
      quantity,
      lineTotal: unitPrice * quantity,
    },
  };
}

export function estimateCustomPerfumePrice(payload: Omit<CustomPerfumePayload, "quantity">): {
  basePrice: number;
  bottlePrice: number;
  capPrice: number;
  totalPrice: number;
} {
  const result = validateCustomPerfume({ ...payload, quantity: 1 });
  if (!result.ok) {
    return { basePrice: 0, bottlePrice: 0, capPrice: 0, totalPrice: 0 };
  }
  return {
    basePrice: result.data.basePrice,
    bottlePrice: result.data.bottlePrice,
    capPrice: result.data.capPrice,
    totalPrice: result.data.unitPrice,
  };
}
