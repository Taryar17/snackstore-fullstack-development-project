import { NavLink } from "react-router-dom";
import { Icons } from "../../../components/icons";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";

const adminNav = [
  { title: "Dashboard", href: "/admin", icon: Icons.layout },
  { title: "Products", href: "/admin/products", icon: Icons.package },
  { title: "Categories", href: "/admin/categories", icon: Icons.layers },
  { title: "Orders", href: "/admin/orders", icon: Icons.cart },
  { title: "Users", href: "/admin/users", icon: Icons.user },
  { title: "Reviews", href: "/admin/reviews", icon: Icons.star },
];

function AdminSidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-4 text-lg font-bold">Admin Panel</div>

      <nav className="flex flex-col gap-1 px-2">
        {adminNav.map((item) => (
          <NavLink
            key={item.title}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition
               ${isActive ? "bg-muted font-medium" : "text-muted-foreground"}`
            }
          >
            <item.icon className="size-4" />
            {item.title}
          </NavLink>
        ))}
        <Button
          variant="outline"
          className="rounded bg-primary px-4 py-2 text-white"
          asChild
        >
          <Link to="/">Go to Home</Link>
        </Button>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
