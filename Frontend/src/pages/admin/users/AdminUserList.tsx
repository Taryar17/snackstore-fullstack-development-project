import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { adminUsersQuery } from "../../../api/query";

function AdminUserList() {
  const { data: users = [] } = useQuery(adminUsersQuery());

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <div className="rounded-lg border bg-background p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">Name</th>
              <th className="text-left">Email</th>
              <th className="text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td>{user.email}</td>
                <td>
                  <Link
                    to={`/admins/users/${user.id}`}
                    className="text-primary underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUserList;
