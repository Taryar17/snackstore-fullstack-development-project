import { Form, useParams, useNavigation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { adminTypeQuery } from "../../../api/query";

function AdminTypeDetail() {
  const { typeId } = useParams();
  const navigation = useNavigation();
  const { data: type, isLoading } = useQuery(adminTypeQuery(Number(typeId)));

  const isSubmitting = navigation.state === "submitting";

  if (isLoading) return <p>Loading...</p>;

  return (
    <Form method="post" className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold">Type Detail</h1>

      <div>
        <label className="text-sm font-medium">Type Name</label>
        <Input name="name" defaultValue={type.name} required />
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

export default AdminTypeDetail;
