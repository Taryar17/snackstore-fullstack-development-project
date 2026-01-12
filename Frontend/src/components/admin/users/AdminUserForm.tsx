import { Form } from "react-router-dom";

const imageUrl = import.meta.env.VITE_IMG_URL;

function AdminUserForm({ user }: any) {
  return (
    <Form method="post" className="space-y-6 rounded-lg border p-6">
      {/* Avatar + Name */}
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 overflow-hidden rounded-full border bg-muted">
          <img
            src={user.image ? imageUrl + user.image : "/avatar-placeholder.png"}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Name</label>
          <p className="mt-1 rounded border px-3 py-2">
            {user.firstName} {user.lastName}
          </p>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium">Email</label>
        <p className="mt-1 rounded border px-3 py-2">{user.email}</p>
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-medium">Phone</label>
        <p className="mt-1 rounded border px-3 py-2">{user.phone}</p>
      </div>

      {/* Address */}
      <div>
        <label className="text-sm font-medium">Email</label>
        <p className="mt-1 rounded border px-3 py-2">{user.address}</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">City</label>
          <p className="mt-1 rounded border px-3 py-2">{user.city}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Region</label>
          <p className="mt-1 rounded border px-3 py-2">{user.region}</p>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-sm font-medium">Status</label>
        <select
          name="status"
          defaultValue={user.status}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="FREEZE">FREEZE</option>
        </select>
      </div>

      {/* Role */}
      <div>
        <label className="text-sm font-medium">Role</label>
        <select
          name="role"
          defaultValue={user.role}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Submit */}
      <button className="rounded bg-primary px-4 py-2 text-white">
        Update User
      </button>
    </Form>
  );
}

export default AdminUserForm;
