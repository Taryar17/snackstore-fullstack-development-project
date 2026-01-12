// ReviewForm.tsx
import { useState } from "react";
import { Form, useNavigation } from "react-router-dom";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import Rating from "../products/Rating";

interface ReviewFormProps {
  productId: number;
  onSuccess?: () => void;
}

const ReviewForm = ({ productId, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const handleSubmit = (e: React.FormEvent) => {
    if (rating === 0) {
      e.preventDefault();
      alert("Please select a rating");
      return;
    }
  };

  return (
    <Form
      method="post"
      className="space-y-4 rounded-md border p-4"
      onSubmit={handleSubmit}
    >
      <h4 className="font-medium">Your Review</h4>

      <input type="hidden" name="_action" value="createReview" />
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="rating" value={rating} />

      <div className="flex items-center gap-2">
        <span className="text-sm">Rating:</span>
        <Rating
          rating={rating}
          interactive
          onChange={(value) => setRating(value)}
        />
      </div>

      <Textarea name="comment" placeholder="Write your review..." rows={4} />

      <Button type="submit" disabled={rating === 0 || isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </Button>
    </Form>
  );
};

export default ReviewForm;
