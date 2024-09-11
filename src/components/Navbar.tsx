import { Link, Outlet } from "react-router-dom"
import { ModeToggle } from "./ui/mode-toggle"
import { ThemeProvider } from "./ui/theme-provider"
import { Can } from "./Can"
import { LogIn, LogOut } from "lucide-react"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "./ui/navigation-menu"
import { useContext, useState } from "react"
import { Badge } from "./ui/badge"
import { UserContext } from "../providers/user-provider"
import {
  Sheet,
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
import { ApiErrorResponse } from "@/types"
import { AvatarIcon } from "@radix-ui/react-icons"
import { ZodIssue } from "zod"
import { profileSchema } from "@/schemas/profile"

const Navbar = () => {
  const [badge, setBadge] = useState({ name: "", role: "" })
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [validationErrors, setValidationErrors] = useState<ZodIssue[]>([])
  const [open, setOpen] = useState(false)

  const context = useContext(UserContext)
  if (!context) {
    return null
  }
  const { user, logout, token } = context

  const [prevUser, setPrevUser] = useState(user)
  if (user !== prevUser && user) {
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setBadge({ name: user.firstName, role: user.role })
    setPrevUser(user)
  }

  const handleLogout = () => {
    logout()
  }

  const errorsAsObject = validationErrors.reduce((validationErrors, validationError) => {
    return {
      ...validationErrors,
      [validationError.path[0]]: validationError.message
    }
  }, {} as { [key: string]: string })

  const handleEditUser = async () => {
    setValidationErrors([])
    const payload = {
      firstName: firstName,
      lastName: lastName
    }
    const result = profileSchema.safeParse(payload)

    if (!result.success) {
      setValidationErrors(result.error.errors)
    } else {
      setValidationErrors([])

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
            className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
            description: `User "${updatedUser.firstName}" edited successfully.`
          })
          setOpen(false)
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
                      <Sheet open={open} onOpenChange={setOpen}>
                        <form>
                          <SheetTrigger asChild>
                            <div className="ml-5 cursor-pointer">Profile</div>
                          </SheetTrigger>
                          <SheetContent className="overflow-y-scroll">
                            <SheetHeader>
                              <SheetTitle>Profile</SheetTitle>
                              <SheetDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="w-full flex justify-center items-center">
                              <AvatarIcon className="w-32 h-32 text-zinc-300" />
                            </div>

                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="id" className="text-right">
                                  User ID
                                </Label>
                                <Input
                                  id="id"
                                  defaultValue={user?.id}
                                  className="col-span-3 border-0"
                                  disabled={true}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="firstName" className="text-right">
                                  First Name
                                </Label>
                                <Input
                                  id="firstName"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  className="col-span-3"
                                />
                              </div>
                              {errorsAsObject["firstName"] && (
                                <p className="text-red-400">{errorsAsObject["firstName"]}</p>
                              )}
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
                              {errorsAsObject["lastName"] && (
                                <p className="text-red-400">{errorsAsObject["lastName"]}</p>
                              )}
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">
                                  Email
                                </Label>
                                <Input
                                  id="email"
                                  defaultValue={context.user?.email}
                                  className="col-span-3 border-0"
                                  disabled={true}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="address" className="text-right">
                                  Address
                                </Label>
                                <Input
                                  id="address"
                                  defaultValue={context.user?.address}
                                  className="col-span-3 border-0"
                                  disabled={true}
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="phoneNumber" className="text-right">
                                  Phone Number
                                </Label>
                                <Input
                                  id="phoneNumber"
                                  defaultValue={context.user?.phoneNumber}
                                  className="col-span-3 border-0"
                                  disabled={true}
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="birthDate" className="text-right">
                                  Birth Date
                                </Label>
                                <Input
                                  id="birthDate"
                                  defaultValue={context.user?.birthDate.toString()}
                                  className="col-span-3 border-0"
                                  disabled={true}
                                />
                              </div>

                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">
                                  Role
                                </Label>
                                <Input
                                  id="role"
                                  defaultValue={context.user?.role}
                                  className="col-span-3 border-0"
                                  disabled={true}
                                />
                              </div>
                            </div>
                            <SheetFooter>
                              <Button onClick={handleEditUser}>Save changes</Button>
                            </SheetFooter>
                          </SheetContent>
                        </form>
                      </Sheet>
                    </NavigationMenuItem>
                  )}
                ></Can>
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
