import MainNavigation from "./MainNavigation";
import { siteConfig } from "../../config/site";
import MediaNavigation from "./MediaNavigation";
import { ModeToggle } from "../mode-toggle";

function Header() {
  return (
    <header className="w-full border-b">
      <nav className="container flex items-center h-16 mx-auto">
        <MainNavigation items={siteConfig.mainNav} />
        <MediaNavigation items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4 mr-8 lg:mr-0">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

export default Header;
