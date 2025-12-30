import type { Review } from "../types/index";

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;

  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Number((total / reviews.length).toFixed(1));
}
