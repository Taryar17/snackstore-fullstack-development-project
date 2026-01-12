// components/layout/Header.tsx
import MainNavigation from "./MainNavigation";
import { siteConfig } from "../../config/site";
import MediaNavigation from "./MediaNavigation";
import { ModeToggle } from "../mode-toggle";
import AuthDropDown from "./AuthDropDown";
import CartSheet from "./CartSheet";
import ProgressBar from "../progress-bar";
import { useSuspenseQuery } from "@tanstack/react-query";
import { userQuery } from "../../api/query";
import { Skeleton } from "../ui/skeleton";

function Header() {
  const { data: user, isLoading } = useSuspenseQuery(userQuery());

  return (
    <header className="w-full border-b">
      <nav className="container flex items-center h-16 mx-auto">
        <ProgressBar />
        <MainNavigation items={siteConfig.mainNav} />
        <MediaNavigation items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4 mr-8 lg:mr-0">
          <CartSheet />
          <ModeToggle />
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            <AuthDropDown user={user} />
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
