// components/admin/products/AdminProductForm.tsx
import { Form, useNavigation } from "react-router-dom";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminCategoriesQuery, adminTypesQuery } from "../../../api/query";
import { Icons } from "../../icons";

interface ProductFormProps {
  product?: any;
  isEditing?: boolean;
}

function AdminProductForm({ product, isEditing = false }: ProductFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const { data: categoriesData } = useQuery(adminCategoriesQuery());
  const { data: typesData } = useQuery(adminTypesQuery());

  // State for form values
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    discount: product?.discount || 0,
    inventory: product?.inventory || 1,
    category: product?.category?.name || "",
    type: product?.type?.name || "",
    tags: product?.tags?.map((t: any) => t.name).join(", ") || "",
    status: product?.status || "ACTIVE",
    pstatus: product?.pstatus || "ORDER",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    product?.images?.map(
      (img: any) => `${import.meta.env.VITE_IMG_URL}${img.path}`
    ) || []
  );

  // Update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        discount: product.discount || 0,
        inventory: product.inventory || 1,
        category: product.category?.name || "",
        type: product.type?.name || "",
        tags: product.tags?.map((t: any) => t.name).join(", ") || "",
        status: product.status || "ACTIVE",
        pstatus: product.pstatus || "ORDER",
      });
    }
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discount"
          ? parseFloat(value) || 0
          : name === "inventory"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls].slice(0, 4)); // Max 4 images
  };

  const removeImage = (index: number) => {
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Get categories and types for dropdowns
  const categories = categoriesData || [];
  const types = typesData || [];

  return (
    <Form
      method="post"
      className="space-y-6 rounded-lg border bg-background p-6"
      encType="multipart/form-data"
    >
      <h1 className="text-2xl font-bold">
        {isEditing ? "Edit Product" : "Create New Product"}
      </h1>
      {isEditing && product?.id && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Product Name *</label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Enter product name"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Price ($) *</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            min="0.1"
            value={formData.price}
            onChange={handleInputChange}
            required
            placeholder="0.00"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Discount (%)</label>
          <Input
            name="discount"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.discount}
            onChange={handleInputChange}
            placeholder="0"
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Inventory *</label>
          <Input
            name="inventory"
            type="number"
            min="1"
            value={formData.inventory}
            onChange={handleInputChange}
            required
            placeholder="0"
            className="mt-1"
          />
        </div>
      </div>

      {/* Status Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Product Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Purchase Status *</label>
          <select
            name="pstatus"
            value={formData.pstatus}
            onChange={handleInputChange}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="ORDER">Order</option>
            <option value="PREORDER">Preorder</option>
          </select>
        </div>
      </div>

      {/* Category and Type */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="">Select category</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Type *</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            required
            className="mt-1 w-full rounded-md border px-3 py-2"
          >
            <option value="">Select type</option>
            {types.map((type: any) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Description *</label>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          placeholder="Enter product description"
          className="mt-1"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium">Tags (comma-separated)</label>
        <Input
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          placeholder="spicy, popular, new, etc."
          className="mt-1"
        />
        <p className="mt-1 text-sm text-muted-foreground">
          Separate tags with commas
        </p>
      </div>

      {/* Images Upload */}
      <div>
        <label className="text-sm font-medium">Product Images (Max 4)</label>
        <div className="mt-2 grid grid-cols-2 gap-4 md:grid-cols-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-32 w-full rounded-md object-cover"
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute right-1 top-1 h-6 w-6"
                onClick={() => removeImage(index)}
              >
                ×
              </Button>
            </div>
          ))}

          {previewUrls.length < 4 && (
            <div className="flex h-32 items-center justify-center rounded-md border-2 border-dashed">
              <label
                htmlFor="images"
                className="cursor-pointer p-4 text-center"
              >
                <Icons.upload className="mx-auto mb-2 h-8 w-8" />
                <span className="text-sm">Upload Image</span>
                <input
                  id="images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload up to 4 images. First image will be the main display image.
        </p>
      </div>

      {/* Hidden field for productId if editing */}
      {isEditing && product?.id && (
        <input type="hidden" name="productId" value={product.id} />
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          name="_action"
          value="save"
          disabled={isSubmitting}
          className="min-w-32"
        >
          {isSubmitting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Saving..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Save Changes"
          ) : (
            "Create Product"
          )}
        </Button>

        <Button
          type="submit"
          name="_action"
          value="cancel"
          variant="outline"
          disabled={isSubmitting}
          asChild
        >
          <a href="/admins/products">Cancel</a>
        </Button>
      </div>
    </Form>
  );
}

export default AdminProductForm;
