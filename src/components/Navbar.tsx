import { Link, Outlet } from "react-router-dom"
import { ModeToggle } from "./ui/mode-toggle"
import { ThemeProvider } from "./ui/theme-provider"
import { Can } from "./Can"
import { LogIn, LogOut } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import { useContext, useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { UserContext } from "../providers/user-provider"

const Navbar = () => {
  const [badge, setBadge] = useState({ name: "", role: "" })
  const context = useContext(UserContext)
  if (!context) {
    return null
  }
  const { user, logout } = context

  useEffect(() => {
    if (user) {
      setBadge({ name: user.firstName, role: user.role })
    }
  }, [context.user?.role])

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="p-2 flex justify-between items-center">
          <ModeToggle />
          <div className="flex items-center">
            {context.user ? (
              <Badge variant="destructive">{badge.name + " (" + badge.role + ")"}</Badge>
            ) : (
              <Badge>GUEST</Badge>
            )}
            <NavigationMenu className="p-2 flex">
              <NavigationMenuList className="flex flex-row space-x-4">
                <NavigationMenuItem>
                  <Link to="/">Home</Link>
                </NavigationMenuItem>
                <Can
                  permission="PRODUCT:ADD"
                  permissionType="actions"
                  yes={() => (
                    <NavigationMenuItem>
                      <Link to="/products">Products</Link>
                    </NavigationMenuItem>
                  )}
                ></Can>
                <Can
                  permission="USER:GET"
                  permissionType="actions"
                  yes={() => (
                    <NavigationMenuItem>
                      <Link to="/users">Users</Link>
                    </NavigationMenuItem>
                  )}
                ></Can>
                <Can
                  permission="ORDER:GET"
                  permissionType="actions"
                  yes={() => (
                    <NavigationMenuItem>
                      <Link to="/orders">Orders</Link>
                    </NavigationMenuItem>
                  )}
                ></Can>
                <Can
                  permission="PAYMENT:GET"
                  permissionType="actions"
                  yes={() => (
                    <NavigationMenuItem>
                      <Link to="/payments">Payments</Link>
                    </NavigationMenuItem>
                  )}
                ></Can>
                <NavigationMenuItem>
                  {context.user ? (
                    <Link to="/" onClick={handleLogout}>
                      <LogOut />
                    </Link>
                  ) : (
                    <Link to="/login">
                      <LogIn />
                    </Link>
                  )}
                </NavigationMenuItem>
                <NavigationMenuItem></NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <Outlet />
      </ThemeProvider>
    </>
  )
}

export default Navbar
