import { useQuery } from "@tanstack/react-query";
import { Switch } from "../../../components/ui/switch";
import { adminReviewsQuery } from "../../../api/query";
import { Form } from "react-router-dom";
import { Card } from "../../../components/ui/card";
import { useState } from "react";
import type { Review } from "../../../types";

const AdminReviewList = () => {
  const { data: reviews } = useQuery(adminReviewsQuery());
  const [optimisticStates, setOptimisticStates] = useState<
    Record<number, string>
  >({});

  const grouped = reviews?.reduce((acc: any, r: any) => {
    acc[r.product.name] ||= [];
    acc[r.product.name].push(r);
    return acc;
  }, {});

  const handleStatusChange = (reviewId: number, currentStatus: string) => {
    setOptimisticStates((prev) => ({
      ...prev,
      [reviewId]: currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE",
    }));
  };

  const getCurrentStatus = (review: Review) => {
    if (optimisticStates[Number(review.id)]) {
      return optimisticStates[Number(review.id)];
    }
    return review.status;
  };

  return (
    <div className="space-y-6">
      {grouped &&
        Object.entries(grouped).map(([product, items]: any) => (
          <Card key={product} className="p-4">
            <h3 className="text-lg font-semibold">{product}</h3>

            {items.map((review: any) => {
              const currentStatus = getCurrentStatus(review);
              const newStatus =
                currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
              const isActive = currentStatus === "ACTIVE";

              return (
                <div
                  key={review.id}
                  className="flex justify-between items-start border-b py-3"
                >
                  <div>
                    <p className="font-medium">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <p className="font-medium">{review.user.phone}</p>
                    <p className="text-sm text-muted-foreground my-2">
                      {review.comment}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-muted">
                        {currentStatus}
                      </span>
                      {optimisticStates[review.id] && (
                        <span className="text-xs text-yellow-600 animate-pulse">
                          Updated
                        </span>
                      )}
                    </div>
                  </div>

                  <Form method="patch" id={`form-${review.id}`}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={newStatus}
                      id={`status-${review.id}`}
                    />
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => {
                        const statusInput = document.getElementById(
                          `status-${review.id}`
                        ) as HTMLInputElement;
                        if (statusInput) {
                          statusInput.value = newStatus;
                        }

                        handleStatusChange(review.id, currentStatus);

                        const form = document.getElementById(
                          `form-${review.id}`
                        ) as HTMLFormElement;
                        if (form) {
                          form.requestSubmit();
                        }
                      }}
                    />
                  </Form>
                </div>
              );
            })}
          </Card>
        ))}
    </div>
  );
};

export default AdminReviewList;
