import { Link } from "react-router-dom";

function AdminProductTable() {
  return (
    <div className="rounded-lg border bg-background p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Name</th>
            <th>Price</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((id) => (
            <tr key={id} className="border-b">
              <td className="py-2">Snack {id}</td>
              <td>$5.00</td>
              <td>Active</td>
              <td>
                <Link
                  to={`/admin/products/${id}`}
                  className="text-primary underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductTable;
