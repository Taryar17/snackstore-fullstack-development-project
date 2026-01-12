// pages/admin/AdminProductCreate.tsx
import AdminProductForm from "../../../components/admin/products/AdminProductForm";

function AdminProductCreate() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Create New Product</h1>
      <AdminProductForm />
    </div>
  );
}

export default AdminProductCreate;
