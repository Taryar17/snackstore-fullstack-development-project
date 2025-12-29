import { Icons } from "../icons";
import { Link } from "react-router-dom";
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
  user: User;
}
function AuthDropDown({ user }: UserProps) {
  if (!user) {
    return (
      <Button size="sm" asChild>
        <Link to="/signin">Sign In</Link>
      </Button>
    );
  }

  const initialName = `${user.firstName.charAt(0) ?? ""} ${
    user.lastName.charAt(0) ?? ""
  }`;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="size-8 rounded-full">
            <Avatar>
              <AvatarImage src={user.imageUrl} alt={user.username} />
              <AvatarFallback>{initialName}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1 items-start">
              <p className="text-sm font-medium leading-none">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-sm leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="#">
                <Icons.dashboard className="size-4 mr-2" />
                Dashboard
                <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
              </Link>
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
            <Link to="/login">
              <Icons.exit className="size-4 mr-2" />
              Logout
              <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default AuthDropDown;
