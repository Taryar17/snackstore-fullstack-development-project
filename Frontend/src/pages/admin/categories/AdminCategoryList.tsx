import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { adminCategoriesQuery } from "../../../api/query";
import type { Category } from "../../../types";
import { useFetcher } from "react-router-dom";
import { useState } from "react";

function AdminCategoryList() {
  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery(adminCategoriesQuery());
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <Button asChild>
          <Link to="/admins/categories/new">Add Category</Link>
        </Button>
      </div>

      {categories.map((category: Category) => (
        <CategoryItem
          key={category.id}
          category={category}
          onDelete={refetch}
          isDeleting={deletingId === category.id}
          setDeletingId={setDeletingId}
        />
      ))}
    </div>
  );
}

const CategoryItem = ({
  category,
  onDelete,
  isDeleting,
  setDeletingId,
}: {
  category: Category;
  onDelete: () => void;
  isDeleting: boolean;
  setDeletingId: (id: number | null) => void;
}) => {
  const fetcher = useFetcher();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    setDeletingId(category.id);

    fetcher.submit(
      {
        _action: "delete",
        categoryId: category.id.toString(),
      },
      { method: "post" }
    );
  };

  if (fetcher.state === "idle" && fetcher.data && isDeleting) {
    setDeletingId(null);
    onDelete();
  }

  return (
    <div className="rounded-lg border bg-background p-4">
      <div>
        <h3 className="text-lg font-medium">{category.name}</h3>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/admins/categories/${category.id}`}>View</Link>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminCategoryList;
