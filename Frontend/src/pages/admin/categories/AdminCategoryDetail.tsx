import { Form, useParams, useNavigation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { adminCategoryQuery } from "../../../api/query";

function AdminCategoryDetail() {
  const { categoryId } = useParams();
  const navigation = useNavigation();
  const { data: category, isLoading } = useQuery(
    adminCategoryQuery(Number(categoryId))
  );

  const isSubmitting = navigation.state === "submitting";

  if (isLoading) return <p>Loading...</p>;

  return (
    <Form method="post" className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Category Detail</h1>

      <div>
        <label className="text-sm font-medium">Name</label>
        <Input name="name" defaultValue={category.name} required />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          name="_action"
          value="save"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>

        <Button
          type="submit"
          name="_action"
          value="cancel"
          variant="outline"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}

export default AdminCategoryDetail;
