import api from "@/api"
import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { UserContext } from "@/providers/user-provider"
import { userSchema } from "@/schemas/user"
import { User, AddUser } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { format, parse } from "date-fns"
import { UserPlusIcon } from "lucide-react"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ZodIssue } from "zod"

const UserList = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [role, setRole] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validationErrors, setValidationErrors] = useState<ZodIssue[]>([])
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  interface ApiErrorResponse {
    error: {
      message: string
    }
  }

  const handleAddUser = async (addUser: AddUser) => {
    const result = userSchema.safeParse(addUser)

    if (!result.success) {
      setValidationErrors(result.error.errors)
    } else {
      setValidationErrors([])

      try {
        const res = await api.post(`/users/register`, addUser)
        if (res.status == 200) {
          toast({
            title: "✅ Added!",
            className:"bg-green-100 text-black dark:bg-emerald-900 dark:text-white",
            description: `User "${res.data.data.firstName}" added successfully.`
          })
          queryClient.invalidateQueries({ queryKey: ["users"] })

          setOpen(false)
          return res.data.data
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiErrorResponse>
          if (axiosError.response) {
            toast({
              title: "❌ Adding user failed!",
              description: `${axiosError.response.data.error.message}`
            })
          } else {
            toast({
              title: "❌ Adding user failed!",
              description: error.message || "An unknown error occurred."
            })
          }
        } else {
          toast({
            title: "❌ Adding user failed!",
            description: "An unknown error occurred."
          })
        }
      }
    }
  }
  const navigate = useNavigate()
  const context = useContext(UserContext)
  const token = context?.token
  const handleFetchUsers = async () => {
    const res = await api.get("/users", {
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
    data: users,
    isLoading,
    isError,
    error
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: handleFetchUsers
  })

  {
    isError && (
      <div className="col-span-3 text-center text-red-500 font-semibold">
        <p>Error: {error instanceof Error ? error.message : "An error occurred"}</p>
      </div>
    )
  }

  const errorsAsObject = validationErrors.reduce((validationErrors, validationError) => {
    return {
      ...validationErrors,
      [validationError.path[0]]: validationError.message
    }
  }, {} as { [key: string]: string })

  const [formattedDate, setFormattedDate] = useState<string>("")
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value
    const parsedDate = parse(dateValue, "yyyy-MM-dd", new Date())
    const formatted = format(parsedDate, "dd-MM-yyyy")
    console.log("first", typeof formatted)
    console.log("first", formatted)
    setFormattedDate(formatted)
    setBirthDate(formatted)
  }

  const handleReset = () => {
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setAddress("")
    setPhoneNumber("")
    setValidationErrors([])
    setBirthDate("")
    setFormattedDate("")
  }

  return (
    <>
      <div className="grid items-center justify-center">
        <h2 className="text-3xl font-semibold tracking-tight text-center">List of all Users</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="grid items-center justify-center my-5">
            <DialogTrigger asChild>
              <Button onClick={handleReset}>
                <UserPlusIcon className="mr-4" />
                Add User
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent className="sm:max-w-[450px] overflow-y-scroll max-h-screen">
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Enter the new user&apos;s information here. Click Add when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
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
                  name="lastName"
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
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {errorsAsObject["email"] && <p className="text-red-400">{errorsAsObject["email"]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password *
                </Label>
                <Input
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                  type="password"
                />
              </div>
              {errorsAsObject["password"] && (
                <p className="text-red-400">{errorsAsObject["password"]}</p>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right">
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="col-span-3"
                  type="password"
                />
              </div>
              {errorsAsObject["confirmPassword"] && (
                <p className="text-red-400">{errorsAsObject["confirmPassword"]}</p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role *
              </Label>
              <Select name="role" onValueChange={(value) => setRole(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Set Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="USER">USER</SelectItem>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {errorsAsObject["role"] && <p className="text-red-400">{errorsAsObject["role"]}</p>}
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
                    ? format(parse(formattedDate, "dd-MM-yyyy", new Date()), "yyyy-MM-dd")
                    : ""
                }
                onChange={handleDateChange}
                className="col-span-3 ui-date-picker"
                type="date"
              />
            </div>
            {errorsAsObject["birthDate"] && (
              <p className="text-red-400">{errorsAsObject["birthDate"]}</p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => {
                  handleAddUser({
                    firstName,
                    lastName,
                    email,
                    address,
                    phoneNumber,
                    birthDate,
                    role,
                    password,
                    confirmPassword
                  })
                }}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading && <Loading item="users" />}

        <Table className="">
          <TableCaption>Click on each item to see details and more actions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user, index) => (
              <TableRow
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className="cursor-pointer"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.id.substring(0, 5)}...</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default UserList
