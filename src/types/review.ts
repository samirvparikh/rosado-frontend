export interface ReviewMedia {
  type: "image" | "video";
  url: string;
}

export interface ProductReview {
  id: string;
  rating: number;
  title: string;
  body: string;
  media: ReviewMedia[];
  authorName: string;
  createdAt: string | null;
}

export interface ReviewSummary {
  average: number;
  count: number;
  breakdown: Array<{ rating: number; count: number }>;
}

export interface ProductReviewsResponse {
  summary: ReviewSummary;
  reviews: ProductReview[];
}

export interface ReviewSubmission {
  rating: number;
  title: string;
  body: string;
  files: File[];
}
