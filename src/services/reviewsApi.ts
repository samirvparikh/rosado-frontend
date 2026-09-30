import { homeReviews, type HomeReview } from "@/data/mocks/reviews";

/** Homepage testimonials are static marketing copy, not a database-backed master. */
export async function getHomeReviews(): Promise<HomeReview[]> {
  return homeReviews;
}

export type { HomeReview };
