
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";

const NavBar = () => {
  const location = useLocation();

  return (
    <div className="border-b mb-4 pb-2">
      <NavigationMenu className="mx-auto flex justify-center">
        <NavigationMenuList>
          <NavigationMenuItem className="mx-1">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "outline"}
              >
                Brief Generator
              </Button>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="mx-1">
            <Link to="/rss-reader">
              <Button 
                variant={location.pathname === "/rss-reader" ? "default" : "outline"}
              >
                RSS Reader
              </Button>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavBar;
