import type { Product, ProductBadge } from "@/types";

export function getProductBadges(product: Product): ProductBadge[] {
  const badges: ProductBadge[] = [];
  if (product.isNewArrival) badges.push("New");
  if (product.isBestSeller) badges.push("Best Seller");
  if (product.isFeatured) badges.push("Featured");
  if (product.isLimitedEdition) badges.push("Limited Edition");
  if (product.isTrending) badges.push("Trending");
  if (product.isSale) badges.push("Sale");
  return badges;
}
