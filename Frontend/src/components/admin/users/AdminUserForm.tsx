import { useParams } from "react-router-dom";
import type { User } from "../../../types";

interface UserProps {
  users: User[];
}

function AdminUserForm({ users }: UserProps) {
  const { userId } = useParams();
  const user = users.find((user) => user.id == userId);
  return (
    <form className="space-y-4 rounded-lg border bg-background p-6">
      <div className="flex flex-col justify-between space-y-2">
        <label className="text-sm font-medium">Name</label>
        <label className="mt-1 w-full rounded border px-3 py-2 text-muted-foreground">
          {user?.firstName} {user?.lastName}
        </label>
      </div>
      <div className="flex flex-col justify-between space-y-2">
        <label className="text-sm font-medium">Email</label>
        <label className="mt-1 w-full rounded border px-3 py-2 text-muted-foreground">
          {user?.email}
        </label>
      </div>
      <div className="flex flex-col justify-between space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <label className="mt-1 w-full rounded border px-3 py-2 text-muted-foreground">
          {user?.phone}
        </label>
      </div>
      <div>
        <label className="text-sm font-medium">Status</label>
        <select className="mt-1 w-full rounded border px-3 py-2">
          <option>ACTIVE</option>
          <option>INACTIVE</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Role</label>
        <select className="mt-1 w-full rounded border px-3 py-2">
          <option>User</option>
          <option>Admin</option>
        </select>
      </div>

      <button className="rounded bg-primary px-4 py-2 text-white">
        Update User
      </button>
    </form>
  );
}

export default AdminUserForm;
