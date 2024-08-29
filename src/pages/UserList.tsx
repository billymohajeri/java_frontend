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
import { passwordSchema } from "@/schemas/user"
import { User, AddUser } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"

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
  const [passwordError, setPasswordError] = useState("")

  const handleAddUser = async (adddUser: AddUser) => {
    const result = passwordSchema.safeParse({ password, confirmPassword })

    if (!result.success) {
      setPasswordError(result.error.errors[0].message)
      console.log(passwordError)
    } else {
      setPasswordError("")
    }

    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
      birthDate: birthDate,
      role: role,
      password: password
    }
    const res = await api.post(`/users/register`, payload)
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    console.log(token)
    toast({
      title: "✅ Added!",
      description: `User "${res.data.data.firstName}" added successfully.`
    })
    navigate("/users")
    return res.data.data
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

  // const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setPassword(e.target.value)
  //   setPasswordError("")
  // }

  // const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setConfirmPassword(e.target.value)
  //   setPasswordError("")
  // }

  // const validatePasswords = () => {
  //   if (password !== confirmPassword) {
  //     setPasswordError("Passwords do not match")
  //   } else {
  //     setPasswordError("")
  //   }
  // }

  return (
    <>
      <div className="grid items-center justify-center">
        <h2 className="text-3xl font-semibold tracking-tight text-center">List of all users</h2>
        <Dialog>
          <DialogTrigger asChild>
            <div className="grid items-center justify-center my-5">
              <Button>➕ Add User</Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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
                {passwordError && <p className="text-red-400">{passwordError}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role *
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="col-span-3"
                />
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
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="birthDate" className="text-right">
                  Birth Date *
                </Label>
                <Input
                  id="birthDate"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
            

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
                    phoneNumber: parseInt(phoneNumber),
                    birthDate,
                    role,
                    password
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
                <TableCell>{user.id}</TableCell>
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
