import Rating from "../products/Rating";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import type { Review } from "../../types";

interface ReviewListProps {
  reviews: Review[];
}

function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reviews yet. Be the first to review this product.
      </p>
    );
  }

  return (
    <ScrollArea className="h-32 pr-4">
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {review.user.firstName} {review.user.lastName}
              </span>
              <Rating rating={review.rating} />
            </div>

            {review.comment && (
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            )}

            <Separator />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export default ReviewList;
