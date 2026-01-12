import { useQuery } from "@tanstack/react-query";
import { adminUserQuery } from "../../../api/query";
import { useParams } from "react-router-dom";
import AdminUserForm from "../../../components/admin/users/AdminUserForm";

function AdminUserDetail() {
  const { userId } = useParams();
  const { data: user } = useQuery(adminUserQuery(Number(userId)));

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">User Detail</h1>
      <AdminUserForm user={user} />
    </div>
  );
}

export default AdminUserDetail;
