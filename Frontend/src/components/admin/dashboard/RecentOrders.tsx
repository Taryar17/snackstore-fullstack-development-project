// components/admin/dashboard/RecentOrders.tsx
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { formatPrice } from "../../../lib/utils";

interface Order {
  id: number;
  code: string;
  customerName: string;
  status: string;
  total: number;
  createdAt: string;
  itemsCount: number;
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
      hour: "2-digit",
      minute: "2-digit",
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
                <th className="py-2">Order Code</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Status</th>
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
                  <td className="py-3">{order.itemsCount} items</td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-3">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admins/orders/${order.id}`}>View</Link>
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
