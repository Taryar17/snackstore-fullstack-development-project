import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { formatPrice } from "../../../lib/utils";
import { Icons } from "../../../components/icons";

interface Order {
  id: number;
  code: string;
  customerName: string;
  status: string;
  total: number;
  createdAt: string;
  itemsCount: number;
  estimatedDeliveryDate?: string | null;
}

interface RecentOrdersProps {
  orders: Order[];
}

function RecentOrders({ orders }: RecentOrdersProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatDeliveryDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Orders</h2>
        <Button variant="outline" size="sm" asChild>
          <Link to="/admins/orders">View All</Link>
        </Button>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Delivery</th>
                <th>Total</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 font-medium">
                    <Link
                      to={`/admins/orders/${order.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {order.code}
                    </Link>
                  </td>
                  <td className="py-3">{order.customerName}</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    {order.estimatedDeliveryDate ? (
                      <div className="flex items-center gap-1">
                        <Icons.calendar className="h-3 w-3 text-green-600" />
                        <span className="text-xs">
                          {formatDeliveryDate(order.estimatedDeliveryDate)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Awaiting date
                      </span>
                    )}
                  </td>
                  <td className="py-3 font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admins/orders/${order.id}`}>Manage</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No recent orders found</p>
        </div>
      )}
    </div>
  );
}

export default RecentOrders;
