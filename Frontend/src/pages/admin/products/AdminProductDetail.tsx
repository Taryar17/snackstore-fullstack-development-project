// pages/admin/AdminProductDetail.tsx
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminProductQuery } from "../../../api/query";
import AdminProductForm from "../../../components/admin/products/AdminProductForm";
import { Icons } from "../../../components/icons";

function AdminProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading } = useQuery(
    adminProductQuery(Number(productId))
  );

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  if (!product)
    return (
      <div className="text-center p-8 text-muted-foreground">
        Product not found
      </div>
    );

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <AdminProductForm product={product} isEditing={true} />
    </div>
  );
}

export default AdminProductDetail;
