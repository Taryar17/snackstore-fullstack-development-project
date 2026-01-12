import { useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Icons } from "../../components/icons";
import { formatPrice } from "../../lib/utils";
import { format } from "date-fns";

const imageUrl = import.meta.env.VITE_IMG_URL;

function OrderDetail() {
  const { order } = useLoaderData();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        onClick={() => navigate("/profile")}
        className="mb-6"
      >
        <Icons.arrowleft /> Back to Profile
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#3b5d50]">
                    Order #{order.id}
                  </h1>
                  <p className="text-muted-foreground">
                    Placed on{" "}
                    {format(new Date(order.createdAt), "MMMM dd, yyyy")}
                  </p>
                </div>
                <Badge
                  className={`${getStatusColor(
                    order.status
                  )} text-sm font-medium`}
                >
                  {order.status}
                </Badge>
              </div>

              <Separator className="my-4" />

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Order Items</h3>
                {order.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <img
                      src={imageUrl + item.product.images[0].path}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.product.pstatus === "PREORDER"
                          ? "Pre-order Item"
                          : "In Stock"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                      <p className="font-bold text-[#3b5d50]">
                        {formatPrice(item.total)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order History */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Order History</h3>
                <div className="space-y-3">
                  {order.histories.map((history: any) => (
                    <div
                      key={history.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          getStatusColor(history.status).split(" ")[0]
                        }`}
                      />
                      <span className="font-medium">{history.status}</span>
                      <span className="text-muted-foreground">
                        {format(
                          new Date(history.createdAt),
                          "MMM dd, yyyy HH:mm"
                        )}
                      </span>
                      {history.note && (
                        <span className="text-muted-foreground">
                          - {history.note}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.name}
                    <br />
                    {order.address}
                    <br />
                    {order.city}, {order.zipCode}
                    <br />
                    {order.phone}
                    <br />
                    {order.email}
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="flex items-center gap-2">
                    <Icons.creditCard className="h-4 w-4" />
                    <span className="text-sm capitalize">
                      {order.paymentMethod.replace("_", " ")}
                    </span>
                    <Badge
                      className={`ml-2 ${getStatusColor(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totalAmount / 1.1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(order.totalAmount * 0.1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-[#3b5d50]">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {order.specialInstructions && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Special Instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        {order.specialInstructions}
                      </p>
                    </div>
                  </>
                )}

                <Button
                  onClick={() => navigate("/products")}
                  className="w-full rounded-full bg-orange-300 mt-4"
                >
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
