import { Link } from "react-router-dom";
import OrderStatusBadge from "../../../components/admin/orders/OrderStatusBadge";

function AdminOrderList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="rounded-lg border bg-background p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Order</th>
              <th className="text-left">Status</th>
              <th className="text-left">Action </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((id) => (
              <tr key={id} className="border-b">
                <td className="py-2">#{id}00</td>
                <td>
                  <OrderStatusBadge status="pending" />
                </td>
                <td>
                  <Link
                    to={`/admin/orders/${id}`}
                    className="text-primary underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrderList;
