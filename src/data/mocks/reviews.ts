export interface HomeReview {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
}

export const homeReviews: HomeReview[] = [
  {
    id: "REV-1",
    name: "Aanya M.",
    city: "Mumbai",
    quote: "I built a 50 ML Woody Oud and it arrived exactly as I configured it. The bottle felt considered, not decorative.",
    rating: 5,
  },
  {
    id: "REV-2",
    name: "Rohan K.",
    city: "Bengaluru",
    quote: "Royal Oud lasts through a late dinner. Quiet projection, long dry-down. This is how fragrance should be sold.",
    rating: 5,
  },
  {
    id: "REV-3",
    name: "Meera S.",
    city: "Delhi",
    quote: "The custom builder made the size and bottle decision obvious. I never felt I was assembling SKUs.",
    rating: 5,
  },
];
