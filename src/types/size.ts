import type { EntityStatus } from "./common";

export interface Size {
  id: string;
  name: string;
  sizeML: number;
  displayName: string;
  sortOrder: number;
  status: EntityStatus;
}
