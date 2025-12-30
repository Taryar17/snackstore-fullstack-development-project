import { Outlet } from "react-router-dom";
import AdminSidebar from "./dashboard/AdminSideBar";

function AdminRootLayout() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-muted/40 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminRootLayout;
