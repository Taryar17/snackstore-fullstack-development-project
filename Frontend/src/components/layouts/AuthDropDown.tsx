import { Icons } from "../icons";
import { Link, Form } from "react-router-dom";
import type { User } from "../../types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

interface UserProps {
  user: User[];
}
function AuthDropDown({ user }: UserProps) {
  if (!user) {
    return (
      <Button size="sm" asChild>
        <Link to="/signin">Sign In</Link>
      </Button>
    );
  }

  const initialName = `${user[1].firstName.charAt(0) ?? ""} ${
    user[1].lastName.charAt(0) ?? ""
  }`;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="size-8 rounded-full">
            <Avatar>
              <AvatarImage src={user[1].imageUrl} alt={user[1].username} />
              <AvatarFallback>{initialName}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1 items-start">
              <p className="text-sm font-medium leading-none">
                {user[1].firstName} {user[1].lastName}
              </p>
              <p className="text-sm leading-none text-muted-foreground">
                {user[1].email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              {user[1].role === "ADMIN" ? (
                <Link to="/admin">
                  <Icons.dashboard className="size-4 mr-2" />
                  Dashboard
                  <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
                </Link>
              ) : (
                <Link to="/profile">
                  <Icons.dashboard className="size-4 mr-2" />
                  Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </Link>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="#">
                <Icons.gear className="size-4 mr-2" />
                Setting
                <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Form method="POST" action="/logout">
              <Button type="submit" className="w-full">
                Logout
              </Button>
            </Form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default AuthDropDown;
