import { Link, Outlet } from "react-router-dom"
import { ModeToggle } from "./ui/mode-toggle"
import { ThemeProvider } from "./ui/theme-provider"
import { Can } from "./Can"
import { LogIn, LogOut } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import { useContext, useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { UserContext } from "../providers/user-provider"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "./ui/sheet"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import api from "@/api"
import { toast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { title } from "process"
import { ApiErrorResponse } from "@/types"

const Navbar = () => {
  const [badge, setBadge] = useState({ name: "", role: "" })
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const context = useContext(UserContext)
  if (!context) {
    return null
  }
  const { user, logout, token } = context

  useEffect(() => {
    if (user) {
      setBadge({ name: user.firstName, role: user.role })
      setFirstName(user.firstName)
      setLastName(user.lastName)
    }
  }, [context.user?.role, context.user])

  const handleLogout = () => {
    logout()
  }

  const handleEditUser = async () => {
    const payload = {
      firstName: firstName,
      lastName: lastName
    }
    try {
      const res = await api.put(`/users/${context.user?.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status == 200) {
        const updatedUser = res.data.data
        setBadge({ name: updatedUser.firstName, role: updatedUser.role })
        toast({
          title: "✅ Edited!",
          className: "bg-green-100 text-black",
          description: `User "${updatedUser.firstName}" edited successfully.`
        })
        return res.data.data
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>
        if (axiosError.response) {
          toast({
            title: "❌ Editing User failed!",
            className: "bg-red-100 text-black",
            description: `${axiosError.response.data.error.message}`
          })
        } else {
          toast({
            title: "❌ Editing User failed!",
            className: "bg-red-100 text-black",
            description: error.message || "An unknown error occurred."
          })
        }
      } else {
        toast({
          title: "❌ Editing User failed!",
          className: "bg-red-100 text-black",
          description: "An unknown error occurred."
        })
      }
    }
  }

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="p-2 flex justify-between items-center">
          <ModeToggle />
          <div className="flex items-center">
            {context.user ? (
              <Badge>{badge.name + " (" + badge.role + ")"}</Badge>
            ) : (
              <Badge variant="secondary">GUEST</Badge>
            )}

            <NavigationMenu className="p-2 flex">
              <NavigationMenuList className="flex flex-row space-x-4">
                <NavigationMenuItem>
                  <Link to="/">Home</Link>
                </NavigationMenuItem>
                <Can
                  permission="PROFILE:VIEW"
                  permissionType="views"
                  yes={() => (
                    <NavigationMenuItem>
                      <Sheet>
                        <form>
                          <SheetTrigger asChild>
                            <div className="ml-5 cursor-pointer">Edit profile</div>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Edit profile</SheetTitle>
                              <SheetDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                  First Name
                                </Label>
                                <Input
                                  id="firstName"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                  Last Name
                                </Label>
                                <Input
                                  id="username"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                            </div>
                            <SheetFooter>
                              <SheetClose asChild>
                                <Button onClick={handleEditUser}>Save changes</Button>
                              </SheetClose>
                            </SheetFooter>
                          </SheetContent>
                        </form>
                      </Sheet>
                    </NavigationMenuItem>
                  )}
                ></Can>
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
