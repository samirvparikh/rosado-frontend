import type { DiscountType, EntityStatus, ImageType } from "./common";

export type ProductType =
  | "READY_MADE"
  | "CUSTOM_PERFUME"
  | "GIFT_SET"
  | "BUNDLE"
  | "LIMITED_EDITION";

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  productType: ProductType;
  shortDescription: string;
  description: string;
  brand: string;
  /** Admin-entered search keywords. */
  tags: string[];
  status: EntityStatus;
  /** Admin's manual In Stock switch. */
  inStock: boolean;
  /** True when In Stock is off or no active size has stock left. */
  soldOut: boolean;
  basePrice?: number;
  salePrice?: number;
  costPrice?: number;
  mrp?: number;
  taxRate: number;
  discountType: DiscountType;
  discountValue: number;
  rating: number;
  reviewCount: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isLimitedEdition: boolean;
  isTrending: boolean;
  isSale: boolean;
}

export interface ProductSize {
  id: string;
  productId: string;
  sizeId: string;
  sku: string;
  mrp: number;
  sellingPrice: number;
  costPrice: number;
  stock: number;
  status: EntityStatus;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  imageType: ImageType;
  sortOrder: number;
  isPrimary: boolean;
  status: EntityStatus;
  alt: string;
}

export interface ProductClassifications {
  audienceIds: string[];
  fragranceFamilyIds: string[];
  occasionIds: string[];
  seasonIds: string[];
  timeOfDayIds: string[];
  intensityIds: string[];
  longevityIds: string[];
  scentCharacterIds: string[];
  collectionIds: string[];
}

export interface ProductDetail extends Product {
  sizes: ProductSize[];
  images: ProductImage[];
  classifications: ProductClassifications;
  fragranceId?: string;
}

export type ProductBadge =
  | "New"
  | "Best Seller"
  | "Featured"
  | "Limited Edition"
  | "Trending"
  | "Sale";

export interface ProductFilters {
  audience?: string[];
  fragranceFamily?: string[];
  occasion?: string[];
  season?: string[];
  timeOfDay?: string[];
  intensity?: string[];
  size?: string[];
  priceMin?: number;
  priceMax?: number;
  badges?: Array<"bestSeller" | "newArrival" | "featured" | "sale">;
  query?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "best-selling";
}

/** A purchasable size as shown on a product card. */
export interface ProductSizeOption {
  sizeId: string;
  displayName: string;
  mrp: number;
  sellingPrice: number;
  inStock: boolean;
}

export interface ProductListItem extends Product {
  primaryImage: string;
  /** Next gallery image, swapped in on card hover. */
  secondaryImage: string | null;
  fromPrice: number;
  defaultSizeId: string;
  sizeOptions: ProductSizeOption[];
  badges: ProductBadge[];
  audienceIds: string[];
  familyNames: string[];
}
