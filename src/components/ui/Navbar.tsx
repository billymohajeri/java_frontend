import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@radix-ui/react-navigation-menu"
import { Link, Outlet } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"
import { ThemeProvider } from "./theme-provider"
import { Can } from "../Can"

const Navbar = () => {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="p-2 flex justify-between items-center">
          <NavigationMenu className="p-2 flex">
            <NavigationMenuList className="flex flex-row space-x-4">
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <i>Socks Shop</i>
                </NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                </Link>
              </NavigationMenuItem>
              <Can
                permission="DASHBOARD:VIEW"
                permissionType="views"
                yes={() => (
                  <NavigationMenuItem>
                    <Link to="/dashboard">
                      <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
                    </Link>
                  </NavigationMenuItem>
                )}
              ></Can>
            </NavigationMenuList>
          </NavigationMenu>
          <ModeToggle />
        </div>
        <Outlet />
      </ThemeProvider>
    </>
  )
}

export default Navbar
