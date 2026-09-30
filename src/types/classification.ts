import type { EntityStatus } from "./common";

export interface ClassificationItem {
  id: string;
  name: string;
  slug: string;
  status: EntityStatus;
  sortOrder: number;
}

export interface ProductClassificationMap {
  productId: string;
  classificationId: string;
}
