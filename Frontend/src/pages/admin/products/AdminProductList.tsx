// pages/admin/AdminProductList.tsx
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import AdminProductTable from "../../../components/admin/products/AdminProductTable"; // Fixed import

function AdminProductList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link to="/admins/products/new">Add Product</Link>
        </Button>
      </div>
      <AdminProductTable />
    </div>
  );
}

export default AdminProductList;
