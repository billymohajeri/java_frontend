import { useContext, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"

import api from "@/api"
import NotFound from "./NotFound"
import Loading from "@/components/Loading"
import NoAccess from "@/components/NoAccess"
import { editUserSchema } from "@/schemas/user"
import { ApiErrorResponse, User } from "@/types"
import { UserContext } from "@/providers/user-provider"

import { ZodIssue } from "zod"
import axios, { AxiosError } from "axios"
import { format, isValid, parse } from "date-fns"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const UserDetails = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [role, setRole] = useState("")
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const [validationErrors, setValidationErrors] = useState<ZodIssue[]>([])

  const navigate = useNavigate()
  const context = useContext(UserContext)
  const token = context?.token
  const userRole = context?.user?.role

  const { id } = useParams<{ id: string }>()

  const handleDeleteUser = async () => {
    const res = await api.delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    toast({
      title: "✅ Deleted!",
      className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
      description: `User "${res.data.data.firstName}" deleted successfully.`
    })
    navigate("/users")
    return res.data.data
  }

  const handleEditUser = async (editedUser: Omit<User, "password" | "confirmPassword">) => {
    const result = editUserSchema.safeParse(editedUser)

    if (!result.success) {
      setValidationErrors(result.error.errors)
    } else {
      setValidationErrors([])

      try {
        const res = await api.put(`/users`, editedUser, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (res.status == 200) {
          toast({
            title: "✅ Edited!",
            className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
            description: `User "${res.data.data.firstName}" edited successfully.`
          })
          queryClient.invalidateQueries({ queryKey: ["user"] })
          setOpen(false)
          return res.data.data
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiErrorResponse>
          if (axiosError.response) {
            toast({
              title: "❌ Editing user failed!",
              className: "bg-red-100 text-black",
              description: `${axiosError.response.data.error.message}`
            })
          } else {
            toast({
              title: "❌ Editing user failed!",
              className: "bg-red-100 text-black",
              description: error.message || "An unknown error occurred."
            })
          }
        } else {
          toast({
            title: "❌ Editing user failed!",
            className: "bg-red-100 text-black",
            description: "An unknown error occurred."
          })
        }
      }
    }
  }

  const handleFetchUser = async () => {
    const res = await api.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    return res.data.data
  }

  const {
    data: user,
    isLoading,
    isError,
    error
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: handleFetchUser,
    enabled: context?.user?.role === "ADMIN"
  })

  const [formattedDate, setFormattedDate] = useState<string>("")
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    const parsedDate = parse(dateValue, "yyyy-MM-dd", new Date())
    const formatted = format(parsedDate, "dd-MM-yyyy")
    setFormattedDate(formatted)
    setBirthDate(formatted)
  }

  const [prevUser, setPrevUser] = useState(user)
  if (user !== prevUser && user) {
    setFirstName(user.firstName)
    setLastName(user.lastName)
    setEmail(user.email)
    setAddress(user.address)
    setPhoneNumber(user.phoneNumber)
    setBirthDate(user.birthDate)
    setRole(user.role)
    setPrevUser(user)
    const parsedDate = parse(user.birthDate, "dd-MM-yyyy", new Date())
    if (isValid(parsedDate)) {
      const formatted = format(parsedDate, "yyyy-MM-dd")
      setFormattedDate(formatted)
    }
  }

  const errorsAsObject = validationErrors.reduce((validationErrors, validationError) => {
    return {
      ...validationErrors,
      [validationError.path[0]]: validationError.message
    }
  }, {} as { [key: string]: string })

  return (
    <>
      {isLoading && <Loading item="User" />}

      {isError && (
        <>
          <div>{error.message.includes("404") && <NotFound />}</div>
          <div className="flex flex-col justify-center items-center h-screen">
            <p className="text-red-500 font-semibold">
              Error: {error?.message || "Unable to fetch user details"}
            </p>
            <div className="mt-4">
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </>
      )}

      {(!token || userRole === "USER") && <NoAccess />}

      {user && (
        <div className="container mx-auto mt-5">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-center mb-5 mt-24">
            User Details
          </h2>
          <div className="bg-white shadow-md rounded-lg p-5">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mt-4 md:mt-0 md:ml-4">
                <div className="p-4">
                  <h5 className="text-2xl font-semibold mb-2 text-gray-900">
                    {user.firstName} {user.lastName}
                  </h5>
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone Number:</strong> {user.phoneNumber}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Address:</strong> {user.address}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Birth Date:</strong> {user.birthDate}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p>
                    <strong className="text-gray-700">User ID:</strong>
                    <span className="text-gray-700 text-sm"> {user.id}</span>
                    <Button variant="link" onClick={() => navigator.clipboard.writeText(user.id)}>
                      Copy ID
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild variant="secondary">
              <Link to="/users">Back to User List</Link>
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary">Edit</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit user</DialogTitle>
                  <DialogDescription>
                    Make changes to this profile here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      First Name *
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
                    <Label htmlFor="lastName" className="text-right">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
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
                      Email *
                    </Label>
                    <Input
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  {errorsAsObject["email"] && (
                    <p className="text-red-400">{errorsAsObject["email"]}</p>
                  )}
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneNumber" className="text-right">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="col-span-3"
                    type="tel"
                  />
                </div>
                {errorsAsObject["phoneNumber"] && (
                  <p className="text-red-400">{errorsAsObject["phoneNumber"]}</p>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="birthDate" className="text-right">
                    Birth Date *
                  </Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    value={
                      formattedDate
                        ? format(parse(birthDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd")
                        : ""
                    }
                    onChange={handleDateChange}
                    className="col-span-3 ui-date-picker"
                    type="date"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role *
                  </Label>
                  <Select
                    name="role"
                    onValueChange={(value) => setRole(value)}
                    defaultValue={user.role}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      if (id) {
                        handleEditUser({
                          id,
                          firstName,
                          lastName,
                          email,
                          address,
                          phoneNumber,
                          birthDate,
                          role
                        })
                      }
                    }}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the selected account
                    and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </>
  )
}

export default UserDetails
