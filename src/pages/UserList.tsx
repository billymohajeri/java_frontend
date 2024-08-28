import api from "@/api"
import Loading from "@/components/Loading"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { UserContext } from "@/providers/user-provider"
import { User } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

const UserList = () => {
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

  return (
    <>
      <div className="grid items-center justify-center">
        <h2 className="  text-3xl font-semibold tracking-tight  text-center ">List of all users</h2>

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
