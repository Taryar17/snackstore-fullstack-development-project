// components/profile/ProfileOrders.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Icons } from "../icons";
import { userOrdersQuery } from "../../api/query";
import { formatPrice } from "../../lib/utils";
import { Badge } from "../ui/badge";

export function ProfileOrders() {
  const { data: ordersData } = useSuspenseQuery(userOrdersQuery(1));
  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.pagination?.total || 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Your Orders</h3>
              <p className="text-muted-foreground text-sm">
                {totalOrders > 0
                  ? `You have ${totalOrders} order${totalOrders > 1 ? "s" : ""}`
                  : "No orders yet"}
              </p>
            </div>
          </div>

          {orders.length > 0 ? (
            <div className="mt-6 space-y-4">
              {orders.slice(0, 3).map((order: any) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Order #{order.code}</span>
                      <Badge
                        className={`${getStatusColor(order.status)} text-xs`}
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)} • {order.itemsCount} items
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    <span className="font-bold text-[#3b5d50]">
                      {formatPrice(order.totalPrice)}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center py-8 border rounded-lg">
              <Icons.package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No orders yet</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
