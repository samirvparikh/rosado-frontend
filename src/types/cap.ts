import type { EntityStatus } from "./common";

export interface Cap {
  id: string;
  name: string;
  code: string;
  image: string;
  additionalPrice: number;
  stock: number;
  status: EntityStatus;
  sortOrder: number;
}

/** Future-ready: empty mapping list means the cap is available for all sizes. */
export interface CapSizeMapping {
  capId: string;
  sizeId: string;
  status: EntityStatus;
}

export interface CapInventory {
  capId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  status: EntityStatus;
}
