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
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";

const imageUrl = import.meta.env.VITE_IMG_URL;

function AdminOrderDetail() {
  const { order, summary } = useLoaderData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(
    order.estimatedDeliveryDate
      ? new Date(order.estimatedDeliveryDate).toISOString().split("T")[0]
      : ""
  );
  const [isSettingDelivery, setIsSettingDelivery] = useState(false);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  const handleSetDeliveryDate = async () => {
    if (!deliveryDate) {
      toast({
        title: "Date required",
        description: "Please select a delivery date",
        variant: "destructive",
      });
      return;
    }

    const selectedDate = new Date(deliveryDate);
    if (selectedDate < new Date()) {
      toast({
        title: "Invalid date",
        description: "Delivery date must be in the future",
        variant: "destructive",
      });
      return;
    }

    setIsSettingDelivery(true);
    try {
      await api.patch(`/admins/orders/${order.id}/delivery-date`, {
        estimatedDeliveryDate: deliveryDate,
      });
      toast({
        title: "Delivery Date Set",
        description: `Delivery date set to ${formatDate(deliveryDate)}`,
      });
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Failed to set date",
        description:
          error.response?.data?.message || "Failed to set delivery date",
        variant: "destructive",
      });
    } finally {
      setIsSettingDelivery(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    try {
      await api.patch(`/admins/orders/${order.id}/delivered`);
      toast({
        title: "Order Delivered",
        description: "Order marked as delivered successfully",
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to mark as delivered",
        variant: "destructive",
      });
    }
  };

  // Calculate min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

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
        {/* Order Items */}
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
              <h2 className="mb-4 text-lg font-semibold">
                Delivery Management
              </h2>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Estimated Delivery
                  </span>
                  {order.estimatedDeliveryDate ? (
                    <Badge className="bg-green-100 text-green-800">
                      {formatDate(order.estimatedDeliveryDate)}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50">
                      Not set
                    </Badge>
                  )}
                </div>

                {order.actualDeliveryDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Actual Delivery
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {formatDate(order.actualDeliveryDate)}
                    </Badge>
                  </div>
                )}
              </div>

              {(!order.estimatedDeliveryDate || order.status === "PENDING") && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">
                      Set Estimated Delivery Date
                    </Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={minDate}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      The customer will be notified of this delivery date
                    </p>
                  </div>
                  <Button
                    onClick={handleSetDeliveryDate}
                    disabled={isSettingDelivery || !deliveryDate}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {isSettingDelivery ? (
                      <>
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                        Setting Date...
                      </>
                    ) : (
                      <>
                        <Icons.calendar className="mr-2 h-4 w-4" />
                        Set Delivery Date
                      </>
                    )}
                  </Button>
                </div>
              )}

              {order.estimatedDeliveryDate &&
                !order.actualDeliveryDate &&
                order.status === "PROCESSING" && (
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      onClick={handleMarkAsDelivered}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Icons.check className="mr-2 h-4 w-4" />
                      Mark as Delivered Now
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>

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
                    "Update Status"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <h2 className="mb-4 text-lg font-semibold">
                Customer Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {order.user.firstName} {order.user.lastName}
                  </p>
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
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{order.user.address}</p>
                  <p className="text-sm">
                    {order.user.city}, {order.user.region}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Timeline</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Placed</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                {order.estimatedDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Estimated Delivery
                    </span>
                    <span>{formatDate(order.estimatedDeliveryDate)}</span>
                  </div>
                )}
                {order.actualDeliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivered On</span>
                    <span>{formatDate(order.actualDeliveryDate)}</span>
                  </div>
                )}
                {order.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Updated</span>
                    <span>
                      {new Date(order.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetail;
