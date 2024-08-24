import { Link, Outlet } from "react-router-dom"
import { ModeToggle } from "./ui/mode-toggle"
import { ThemeProvider } from "./ui/theme-provider"
import { Can } from "./Can"
import { LogIn, LogOut } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext(null)

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem("currentUserData")
    // console.log(user);
    if (user) {
      const userObject = JSON.parse(user)
      // console.log(userObject , userObject.user , userObject.token);
      if (userObject && userObject.user && userObject.token) {
        const token = userObject.token
        // console.log(!!token);
        setIsLoggedIn(!!token)
        // console.log(isLoggedIn);
        // console.log(!!token);
      }
    }
  }, [isLoggedIn])

  const handleLogout = () => {
    localStorage.removeItem("currentUserData")
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
