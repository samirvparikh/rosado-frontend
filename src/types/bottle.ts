import type { EntityStatus } from "./common";

export interface Bottle {
  id: string;
  name: string;
  code: string;
  image: string;
  sizeId: string;
  additionalPrice: number;
  stock: number;
  status: EntityStatus;
  sortOrder: number;
}

export interface BottleInventory {
  bottleId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  status: EntityStatus;
}
