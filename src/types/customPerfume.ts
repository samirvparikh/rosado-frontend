import type { Bottle } from "./bottle";
import type { Cap } from "./cap";
import type { Fragrance, FragranceWithNotes } from "./fragrance";
import type { Size } from "./size";

export type BuilderStep = 1 | 2 | 3 | 4 | 5;

export interface CustomPerfumeConfiguration {
  size: Size | null;
  fragrance: Fragrance | null;
  bottle: Bottle | null;
  cap: Cap | null;
  basePrice: number;
  bottlePrice: number;
  capPrice: number;
  totalPrice: number;
}

export interface CustomPerfumePayload {
  fragranceId: string;
  sizeId: string;
  bottleId: string;
  capId: string;
  quantity: number;
}

export interface CustomPerfumeValidated {
  fragranceId: string;
  fragranceName: string;
  sizeId: string;
  sizeName: string;
  bottleId: string;
  bottleName: string;
  capId: string;
  capName: string;
  basePrice: number;
  bottlePrice: number;
  capPrice: number;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CustomPerfumePreview extends CustomPerfumeConfiguration {
  fragranceDetail: FragranceWithNotes | null;
}

export const EMPTY_CONFIGURATION: CustomPerfumeConfiguration = {
  size: null,
  fragrance: null,
  bottle: null,
  cap: null,
  basePrice: 0,
  bottlePrice: 0,
  capPrice: 0,
  totalPrice: 0,
};
