import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Icons } from "../../components/icons";
import { formatPrice } from "../../lib/utils";
import { formatDate } from "../../lib/utils";

const imageUrl = import.meta.env.VITE_IMG_URL;

function ProfileOrderDetail() {
  const { order } = useLoaderData();
  const navigate = useNavigate();

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

  return (
    <div className="container mx-auto max-w-4xl py-10 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/profile/orders")}
        >
          <Icons.arrowleft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <Badge className={`${getStatusColor(order.status)} px-4 py-2`}>
          {order.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Order #{order.code}
              </h2>
              <div className="space-y-4">
                {order.products.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4 last:border-0"
                  >
                    {item.product?.images?.[0]?.path && (
                      <img
                        src={imageUrl + item.product.images[0].path}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <div className="space-x-4">
                          <span className="text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            Price: {formatPrice(Number(item.price))}
                          </span>
                        </div>
                        <span className="font-medium">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.totalPrice / 1.1)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(order.totalPrice * 0.1)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#3b5d50]">
                    {formatPrice(order.totalPrice)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Information</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Code</span>
                  <span className="font-medium">{order.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="capitalize">
                    {order.paymentMethod?.toLowerCase().replace("_", " ") ||
                      "Cash on Delivery"}
                  </span>
                </div>
                {order.status === "COMPLETED" && order.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed On</span>
                    <span>{formatDate(order.updatedAt)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            asChild
            className="w-full rounded-full bg-orange-300 hover:bg-orange-400"
          >
            <Link to="/products">
              <Icons.cart className="mr-2 h-4 w-4" />
              Shop Again
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileOrderDetail;
