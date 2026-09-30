import { apiGet } from "./http";
import { getShopFilters } from "./classificationApi";
import type { ProductDetail, ProductFilters, ProductListItem } from "@/types";

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListItem[]> {
  return apiGet<ProductListItem[]>("/products", {
    audience: filters.audience,
    fragranceFamily: filters.fragranceFamily,
    occasion: filters.occasion,
    season: filters.season,
    timeOfDay: filters.timeOfDay,
    intensity: filters.intensity,
    size: filters.size,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    badges: filters.badges,
    query: filters.query,
    sort: filters.sort,
  });
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  return apiGet<ProductDetail | null>(`/products/${slug}`);
}

export async function getFeaturedProducts(): Promise<ProductListItem[]> {
  return apiGet<ProductListItem[]>("/products/featured");
}

export async function getBestSellers(): Promise<ProductListItem[]> {
  return apiGet<ProductListItem[]>("/products/best-sellers");
}

export async function searchProducts(query: string): Promise<ProductListItem[]> {
  if (!query.trim()) return [];
  return apiGet<ProductListItem[]>("/products/search", { query });
}

export async function getProductRecommendations(productId: string): Promise<ProductListItem[]> {
  return apiGet<ProductListItem[]>(`/products/${productId}/recommendations`);
}

/** Resolves the classification IDs on a product detail into display names, for the PDP's family/audience/occasion/season line. */
export async function resolveClassificationNames(detail: ProductDetail) {
  const shop = await getShopFilters();
  const name = (id: string, list: { id: string; name: string }[]) =>
    list.find((item) => item.id === id)?.name;

  return {
    audiences: detail.classifications.audienceIds.map((id) => name(id, shop.audiences)).filter(Boolean),
    families: detail.classifications.fragranceFamilyIds
      .map((id) => name(id, shop.fragranceFamilies))
      .filter(Boolean),
    occasions: detail.classifications.occasionIds.map((id) => name(id, shop.occasions)).filter(Boolean),
    seasons: detail.classifications.seasonIds.map((id) => name(id, shop.seasons)).filter(Boolean),
  };
}
