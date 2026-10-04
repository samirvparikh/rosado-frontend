import type { Cap, CapInventory, CapSizeMapping } from "@/types";

export const caps: Cap[] = [
  {
    id: "CAP001",
    name: "Classic Black",
    code: "CAP001",
    image: "/images/caps/cap-classic-black.png",
    additionalPrice: 0,
    stock: 80,
    status: "ACTIVE",
    sortOrder: 1,
  },
  {
    id: "CAP002",
    name: "Premium Gold",
    code: "CAP002",
    image: "/images/caps/cap-premium-gold.png",
    additionalPrice: 50,
    stock: 42,
    status: "ACTIVE",
    sortOrder: 2,
  },
  {
    id: "CAP003",
    name: "Modern Silver",
    code: "CAP003",
    image: "/images/caps/cap-modern-silver.png",
    additionalPrice: 30,
    stock: 50,
    status: "ACTIVE",
    sortOrder: 3,
  },
];

/** V1: empty. Architecture supports filtering when mappings are added. */
export const capSizeMappings: CapSizeMapping[] = [];

export const capInventory: CapInventory[] = caps.map((cap) => ({
  capId: cap.id,
  currentStock: cap.stock,
  reservedStock: 0,
  availableStock: cap.stock,
  reorderLevel: 8,
  status: cap.status,
}));
