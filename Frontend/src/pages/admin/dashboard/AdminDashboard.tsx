import RecentOrders from "../../../components/admin/dashboard/RecentOrders";
import StatCard from "../../../components/admin/dashboard/StateCart";

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Total Products" value="128" />
        <StatCard title="Total Orders" value="342" />
        <StatCard title="Users" value="89" />
        <StatCard title="Revenue" value="$12,450" />
      </div>
      <RecentOrders />
    </div>
  );
}

export default AdminDashboard;
