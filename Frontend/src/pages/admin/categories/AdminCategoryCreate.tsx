import { Form, useNavigation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

function AdminCategoryCreate() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create New Category</h1>

      <div>
        <label className="text-sm font-medium">Name</label>
        <Input name="name" required placeholder="Enter category name" />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Category"}
        </Button>

        <Button type="button" variant="outline" asChild>
          <a href="/admins/categories">Cancel</a>
        </Button>
      </div>
    </Form>
  );
}

export default AdminCategoryCreate;
