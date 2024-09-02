import { useContext, useEffect, useState } from "react"
import api from "@/api"

import { Can } from "@/components/Can"
import Loading from "@/components/Loading"
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

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { EditUser } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UserContext } from "@/providers/user-provider"
import NoAccess from "@/components/NoAccess"

const UserDetails = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [role, setRole] = useState("")

  const navigate = useNavigate()
  const context = useContext(UserContext)
  const token = context?.token

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
      description: `User "${res.data.data.firstName}" deleted successfully.`
    })
    navigate("/users")
    return res.data.data
  }

  const handleEditUser = async (editedUser: EditUser) => {
    const payload = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      phoneNumber: phoneNumber,
      birthDate: birthDate,
      role: role
    }
    const res = await api.put(`/users`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    toast({
      title: "✅ Edited!",
      description: `User "${res.data.data.firstName}" edited successfully.`
    })
    navigate("/users")
    return res.data.data
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
  } = useQuery<EditUser>({
    queryKey: ["user", id],
    queryFn: handleFetchUser
  })

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setEmail(user.email)
      setAddress(user.address)
      setPhoneNumber(user.phoneNumber.toString())
      setBirthDate(user.birthDate)
      setRole(user.role)
    }
  }, [user])

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">
          Error: {error?.message || "Unable to fetch product details"}
        </p>
      </div>
    )
  }

  return (
    <Can
      permission="USER:EDIT"
      permissionType="actions"
      yes={() => (
        <>
          {isLoading && <Loading item="user" />}
          {user && (
            <div className="container mx-auto mt-5">
              <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
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
                        <small>User ID:</small>
                      </p>
                      <p className="text-gray-500 text-sm">
                        <small>{user.id}</small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <Button asChild>
                  <Link to="/users">Back to User List</Link>
                </Button>
                <Can
                  permission="USER:EDIT"
                  permissionType="actions"
                  yes={() => (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Edit</Button>
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
                            <Label htmlFor="lastName" className="text-right">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="col-span-3"
                            />
                          </div>
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
                            Phone Number
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
                            Birth Date
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
                              if (id) {
                                handleEditUser({
                                  id,
                                  firstName,
                                  lastName,
                                  email,
                                  address,
                                  phoneNumber: parseInt(phoneNumber),
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
                  )}
                ></Can>
                <Can
                  permission="USER:REMOVE"
                  permissionType="actions"
                  yes={() => (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected
                            account and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteUser}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                ></Can>
              </div>
            </div>
          )}
        </>
      )}
      no={() => <NoAccess />}
    />
  )
}

export default UserDetails
