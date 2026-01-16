import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { adminTypesQuery } from "../../../api/query";
import type { Category } from "../../../types";
import { useFetcher } from "react-router-dom";
import { useState } from "react";

function AdminTypeList() {
  const { data: types, isLoading, refetch } = useQuery(adminTypesQuery());
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Types</h1>

        <Button asChild>
          <Link to="/admins/types/new">Add Type</Link>
        </Button>
      </div>

      {types.map((type: Category) => (
        <TypeItem
          key={type.id}
          type={type}
          onDelete={refetch}
          isDeleting={deletingId === type.id}
          setDeletingId={setDeletingId}
        />
      ))}
    </div>
  );
}

const TypeItem = ({
  type,
  onDelete,
  isDeleting,
  setDeletingId,
}: {
  type: Category;
  onDelete: () => void;
  isDeleting: boolean;
  setDeletingId: (id: number | null) => void;
}) => {
  const fetcher = useFetcher();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this type?")) {
      return;
    }

    setDeletingId(type.id);

    fetcher.submit(
      {
        _action: "delete",
        typeId: type.id.toString(),
      },
      { method: "post" }
    );
  };

  if (fetcher.state === "idle" && fetcher.data && isDeleting) {
    setDeletingId(null);
    onDelete();
  }

  return (
    <div className="rounded-lg border p-4">
      <div>
        <h3 className="text-lg font-medium">{type.name}</h3>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to={`/admins/types/${type.id}`}>View</Link>
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

export default AdminTypeList;
