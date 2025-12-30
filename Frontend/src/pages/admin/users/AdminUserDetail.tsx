import AdminUserForm from "../../../components/admin/users/AdminUserForm";
import { User } from "../../../data/user";

function AdminUserDetail() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">User Detail</h1>
      <AdminUserForm users={User} />
    </div>
  );
}

export default AdminUserDetail;
