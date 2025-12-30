function RecentOrders() {
  return (
    <div className="rounded-lg border bg-background p-4">
      <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Order ID</th>
            <th>User</th>
            <th>Status</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((id) => (
            <tr key={id} className="border-b">
              <td className="py-2">#{id}001</td>
              <td>John Doe</td>
              <td>Pending</td>
              <td>$45.00</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentOrders;
