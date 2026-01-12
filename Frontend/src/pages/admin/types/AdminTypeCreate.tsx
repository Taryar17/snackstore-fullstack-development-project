import { Form, useNavigation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

function AdminTypeCreate() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Create New Type</h1>

      <div>
        <label className="text-sm font-medium">Name</label>
        <Input name="name" required placeholder="Enter type name" />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Type"}
        </Button>

        <Button type="button" variant="outline" asChild>
          <a href="/admins/types">Cancel</a>
        </Button>
      </div>
    </Form>
  );
}

export default AdminTypeCreate;
