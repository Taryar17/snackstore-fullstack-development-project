// pages/profile/ProfileOrdersPage.tsx
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Icons } from "../../components/icons";
import { userOrdersQuery } from "../../api/query";
import { formatPrice } from "../../lib/utils";
import { Badge } from "../../components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";

function ProfileOrdersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data: ordersData } = useSuspenseQuery(userOrdersQuery(page));

  const orders = ordersData?.orders || [];
  const pagination = ordersData?.pagination || { page: 1, total: 0, pages: 1 };

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
    <div className="container mx-auto max-w-4xl py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/profile")}
          >
            <Icons.arrowleft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>
        <Button
          asChild
          className="rounded-full bg-orange-300 hover:bg-orange-400"
        >
          <Link to="/products">
            <Icons.cart className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="space-y-4">
            {orders.map((order: any) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-bold">Order #{order.code}</span>
                        <Badge className={`${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Placed on {formatDate(order.createdAt)}</p>
                        <p>
                          {order.itemsCount} items • Total:{" "}
                          {formatPrice(order.totalPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pagination.pages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    size=""
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        size=""
                        onClick={() => setPage(pageNum)}
                        isActive={page === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    size=""
                    onClick={() =>
                      setPage(Math.min(pagination.pages, page + 1))
                    }
                    className={
                      page >= pagination.pages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Icons.package className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-6 text-lg font-semibold">No orders yet</h3>
            <p className="mt-2 text-muted-foreground">
              You haven't placed any orders yet. Start shopping to see your
              orders here.
            </p>
            <Button
              asChild
              className="mt-6 rounded-full bg-orange-300 hover:bg-orange-400"
            >
              <Link to="/products">
                <Icons.cart className="mr-2 h-4 w-4" />
                Browse Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default ProfileOrdersPage;
