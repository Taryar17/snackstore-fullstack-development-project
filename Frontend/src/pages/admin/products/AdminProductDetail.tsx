import AdminProductForm from "../../../components/admin/products/AdminProductForm";

function AdminProductDetail() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <AdminProductForm />
    </div>
  );
}

export default AdminProductDetail;
