import { homeReviews, type HomeReview } from "@/data/mocks/reviews";
import { apiGet, apiPost } from "./http";
import type { ProductReview, ProductReviewsResponse, ReviewSubmission, ReviewSummary } from "@/types";

/** Homepage testimonials are static marketing copy, not a database-backed master. */
export async function getHomeReviews(): Promise<HomeReview[]> {
  return homeReviews;
}

export function getProductReviews(productId: string): Promise<ProductReviewsResponse> {
  return apiGet<ProductReviewsResponse>(`/products/${encodeURIComponent(productId)}/reviews`);
}

/** Requires a signed-in customer; photos/videos are uploaded as multipart `media[]`. */
export function submitProductReview(
  productId: string,
  review: ReviewSubmission,
): Promise<{ review: ProductReview; summary: ReviewSummary }> {
  const form = new FormData();
  form.append("rating", String(review.rating));
  form.append("title", review.title);
  form.append("body", review.body);
  review.files.forEach((file) => form.append("media[]", file));
  return apiPost(`/products/${encodeURIComponent(productId)}/reviews`, form);
}

export type { HomeReview };
