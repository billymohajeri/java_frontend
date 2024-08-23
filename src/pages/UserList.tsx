import api from "@/api"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { User } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

const UserList = () => {
  const handleFetchUsers = async () => {
    const tokenWithQuotes = localStorage.getItem("userToken")
    const token = tokenWithQuotes?.replace(/"/g, "")
    const res = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    console.log(res.data.data)
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

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {error?.message}</div>

  return (
    <div className="grid items-center justify-center">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
        List of all products
      </h2>
      <Table className="">
        <TableCaption>Click on each item to see details and more actions...</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            {/* <TableHead>Address</TableHead> */}
            <TableHead>Email</TableHead>
            {/* <TableHead>Phone Number</TableHead> */}
            {/* <TableHead>Birth Date</TableHead> */}
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <Link key={user.id} to={`/users/${user.id}`} className="contents">
              <TableRow>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                {/* <TableCell>{user.address}</TableCell> */}
                <TableCell>{user.email}</TableCell>
                {/* <TableCell>{user.phoneNumber}</TableCell> */}
                {/* <TableCell>{user.birthDate}</TableCell> */}
                <TableCell>{user.role}</TableCell>
              </TableRow>
            </Link>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default UserList
