// pages/admin/dashboard/AdminDashboard.tsx
import { useSuspenseQuery } from "@tanstack/react-query";
import StatCard from "../../../components/admin/dashboard/StatCard";

import { Icons } from "../../../components/icons";
import { DashboardQuery } from "../../../api/query";

function AdminDashboard() {
  const { data } = useSuspenseQuery(DashboardQuery());

  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Products"
          value={stats.totalProducts?.toString() || "0"}
          icon={Icons.package}
        />
        <StatCard
          title="Total Categories"
          value={stats.totalCategories?.toString() || "0"}
          icon={Icons.layers}
        />
        <StatCard
          title="Total Types"
          value={stats.totalTypes?.toString() || "0"}
          icon={Icons.cube}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders?.toString() || "0"}
          icon={Icons.cart}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers?.toString() || "0"}
          icon={Icons.user}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders?.toString() || "0"}
          icon={Icons.trendingUp}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toFixed(2) || "0.00"}`}
          icon={Icons.dollarSign}
        />
        <StatCard
          title="Active Products"
          value={
            stats.productStatusStats
              ?.find((p: any) => p.pstatus === "ORDER")
              ?._count?.id?.toString() || "0"
          }
          icon={Icons.checkCircle}
        />
      </div>

      {/* Order Status Breakdown */}
      <div className="rounded-lg border bg-background p-4">
        <h2 className="mb-4 text-lg font-semibold">Order Status Breakdown</h2>
        <div className="flex flex-wrap gap-4">
          {stats.orderStatusStats?.map((statusStat: any) => (
            <div key={statusStat.status} className="flex items-center gap-2">
              <div
                className={`h-3 w-3 rounded-full ${
                  statusStat.status === "PENDING"
                    ? "bg-yellow-500"
                    : statusStat.status === "PROCESSING"
                    ? "bg-blue-500"
                    : statusStat.status === "COMPLETED"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm capitalize">
                {statusStat.status.toLowerCase()}
              </span>
              <span className="font-bold">{statusStat._count.id}</span>
            </div>
          )) || (
            <p className="text-muted-foreground">No order data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
