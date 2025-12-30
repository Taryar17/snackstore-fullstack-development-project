import AdminProductTable from "../../../components/admin/products/AdminPoductTable";

function AdminProductList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Products</h1>
      <AdminProductTable />
    </div>
  );
}

export default AdminProductList;
