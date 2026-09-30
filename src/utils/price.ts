import type { CustomPerfumeConfiguration } from "@/types";

export function estimateCustomTotal(basePrice: number, bottlePrice: number, capPrice: number): number {
  return basePrice + bottlePrice + capPrice;
}

export function applyConfigurationPrices(
  config: CustomPerfumeConfiguration,
): CustomPerfumeConfiguration {
  const basePrice = config.size && config.fragrance ? config.basePrice : 0;
  const bottlePrice = config.bottle?.additionalPrice ?? 0;
  const capPrice = config.cap?.additionalPrice ?? 0;
  return {
    ...config,
    basePrice,
    bottlePrice,
    capPrice,
    totalPrice: estimateCustomTotal(basePrice, bottlePrice, capPrice),
  };
}

export function computeDiscount(subtotal: number, type: "PERCENT" | "FLAT", value: number): number {
  if (type === "PERCENT") {
    return Math.round((subtotal * value) / 100);
  }
  return Math.min(value, subtotal);
}

export function inclusiveTax(amount: number, rate = 18): number {
  return Math.round((amount * rate) / (100 + rate));
}
