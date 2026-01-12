import { DashboardQuery } from "../../../api/query";
import { useSuspenseQuery } from "@tanstack/react-query";
import RecentOrders from "../../../components/admin/dashboard/RecentOrders";

function AdminOrderList() {
  const { data } = useSuspenseQuery(DashboardQuery());
  const recentOrders = data?.recentOrders || [];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <RecentOrders orders={recentOrders} />
    </div>
  );
}

export default AdminOrderList;
