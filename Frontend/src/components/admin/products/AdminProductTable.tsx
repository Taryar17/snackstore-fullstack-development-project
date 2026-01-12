// components/admin/products/AdminProductTable.tsx
import { Link } from "react-router-dom";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { useQuery } from "@tanstack/react-query";
import { adminProductsQuery } from "../../../api/query";
import { Form } from "react-router-dom";
import { Icons } from "../../icons";
import { formatPrice } from "../../../lib/utils";

const imageUrl = import.meta.env.VITE_IMG_URL;

function AdminProductTable() {
  const { data: products, isLoading } = useQuery(adminProductsQuery());

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  if (!products || products.length === 0)
    return (
      <div className="text-center p-8 text-muted-foreground">
        No products found
      </div>
    );

  return (
    <div className="space-y-4">
      {products.map((product: any) => (
        <div
          key={product.id}
          className="rounded-lg border bg-background p-4 shadow-sm"
        >
          <div className="flex gap-4">
            {product.images && product.images.length > 0 && (
              <img
                src={imageUrl + product.images[0].path}
                alt={product.name}
                className="h-24 w-24 rounded-md object-cover"
              />
            )}

            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={
                      product.pstatus === "PREORDER" ? "destructive" : "outline"
                    }
                  >
                    {product.pstatus}
                  </Badge>
                </div>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm md:grid-cols-5">
                <span>
                  <strong>Price:</strong> {formatPrice(Number(product.price))}
                </span>
                <span>
                  <strong>Discount:</strong> {product.discount}%
                </span>
                <span>
                  <strong>Inventory:</strong> {product.inventory}
                </span>
                <span>
                  <strong>Status:</strong>
                  <Badge
                    variant={
                      product.status === "ACTIVE" ? "default" : "secondary"
                    }
                    className="ml-1"
                  >
                    {product.status}
                  </Badge>
                </span>
                <span>
                  <strong>Category:</strong> {product.category?.name || "N/A"}
                </span>
                <span>
                  <strong>Type:</strong> {product.type?.name || "N/A"}
                </span>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: any) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-2 flex gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to={`/admins/products/${product.id}`}>Edit</Link>
                </Button>

                <Form method="post">
                  <input type="hidden" name="_action" value="delete" />
                  <input type="hidden" name="productId" value={product.id} />
                  <Button
                    type="submit"
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      if (
                        !confirm(
                          "Are you sure you want to delete this product?"
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminProductTable;
