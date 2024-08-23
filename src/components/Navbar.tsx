import { Link, Outlet } from "react-router-dom"
import { ModeToggle } from "./ui/mode-toggle"
import { ThemeProvider } from "./ui/theme-provider"
import { Can } from "./Can"
import { LogIn, LogOut } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import { useEffect, useState } from "react"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("userToken")
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userToken")
    setIsLoggedIn(false)
  }

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="p-2 flex justify-between items-center">
          <ModeToggle />
          <NavigationMenu className="p-2 flex">
            <NavigationMenuList className="flex flex-row space-x-4">
              <NavigationMenuItem>
                <Link to="/">Home</Link>
              </NavigationMenuItem>
              <Can
                permission="DASHBOARD:VIEW"
                permissionType="views"
                yes={() => (
                  <NavigationMenuItem>
                    <Link to="/dashboard">Dashboard</Link>
                  </NavigationMenuItem>
                )}
              ></Can>
              <Can
                permission="USER:VIEW"
                permissionType="views"
                yes={() => (
                  <NavigationMenuItem>
                    <Link to="/users">Users</Link>
                  </NavigationMenuItem>
                )}
              ></Can>
              <NavigationMenuItem>
                {isLoggedIn ? (
                  <Link to="/logout" onClick={handleLogout}>
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
        <Outlet />
      </ThemeProvider>
    </>
  )
}

export default Navbar
