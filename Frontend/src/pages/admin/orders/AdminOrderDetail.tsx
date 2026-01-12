// pages/admin/orders/AdminOrderDetail.tsx
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Separator } from "../../../components/ui/separator";
import { Badge } from "../../../components/ui/badge";
import { Icons } from "../../../components/icons";
import { formatPrice } from "../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useToast } from "../../../hook/use-toast";
import api from "../../../api";

const imageUrl = import.meta.env.VITE_IMG_URL;

function AdminOrderDetail() {
  const { order, summary } = useLoaderData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusBadgeClass = (status: string) => {
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

  const handleUpdateStatus = async () => {
    if (status === order.status) {
      toast({
        title: "No changes",
        description: "Order status is already set to this value.",
      });
      return;
    }

    setIsUpdating(true);

    try {
      await api.put(`/admins/orders/${order.id}/status`, { status });

      toast({
        title: "Status Updated",
        description: `Order status changed to ${status}`,
      });

      // Refresh the page data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admins/orders")}
          >
            <Icons.arrowleft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-[#3b5d50]">
              Order #{order.code}
            </h1>
            <p className="text-sm text-muted-foreground">
              Created: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge className={`${getStatusBadgeClass(order.status)} px-3 py-1`}>
          {order.status}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
              <div className="space-y-4">
                {order.products.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4 last:border-0"
                  >
                    <img
                      src={imageUrl + item.product.images[0].path}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <div className="mt-1 flex items-center justify-between text-sm">
                        <div className="space-x-4">
                          <span className="text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-muted-foreground">
                            Price: {formatPrice(Number(item.product.price))}
                          </span>
                          <Badge variant="outline">
                            {item.product.pstatus}
                          </Badge>
                        </div>
                        <span className="font-medium">
                          {formatPrice(
                            Number(item.product.price) * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 text-lg font-semibold">Order Details</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID</span>
                  <span>{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Code</span>
                  <span>{order.code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{new Date(order.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Status Update */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 text-lg font-semibold">Update Status</h2>
              <div className="flex items-center gap-4">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PROCESSING">Processing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating || status === order.status}
                  className="bg-orange-300 hover:bg-orange-400"
                >
                  {isUpdating ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary & Info */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal ({summary.itemsCount} items)</span>
                  <span>{formatPrice(summary.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(summary.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#3b5d50]">
                    {formatPrice(summary.total)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Customer</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {order.user.firstName} {order.user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{order.user.address}</p>
                </div>
                <div className="flex item-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{order.user.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">{order.user.region}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.user.phone}</p>
                </div>
                {order.user.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{order.user.email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
