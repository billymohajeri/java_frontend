import api from "@/api"
import { Can } from "@/components/Can"
import Loading from "@/components/Loading"
import NoAccess from "@/components/NoAccess"
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
import { useNavigate } from "react-router-dom"

const UserList = () => {
  const navigate = useNavigate()
  const handleUsersPageRender = () => {
    const handleFetchUsers = async () => {
      let token = ""
      const user = localStorage.getItem("currentUserData")
      if (user) {
        try {
          const objUser = JSON.parse(user)
          const tokenWithQuotes = objUser?.token || null
          token = tokenWithQuotes?.replace(/"/g, "")
        } catch (error) {
          console.error("Failed to parse user data:", error)
        }
      }
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
      <div className="grid items-center justify-center">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
          List of all users
        </h2>

        {isLoading && <Loading item="users" />}

        <Table className="">
          <TableCaption>Click on each item to see details and more actions.</TableCaption>
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
              // <Link key={user.id} to={`/users/${user.id}`} className="contents">
              <TableRow
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                className="cursor-pointer"
              >
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                {/* <TableCell>{user.address}</TableCell> */}
                <TableCell>{user.email}</TableCell>
                {/* <TableCell>{user.phoneNumber}</TableCell> */}
                {/* <TableCell>{user.birthDate}</TableCell> */}
                <TableCell>{user.role}</TableCell>
              </TableRow>
              // </Link>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
  return (
    <>
      <Can
        permission="USER:VIEW"
        permissionType="views"
        yes={() => handleUsersPageRender()}
        no={() => <NoAccess />}
      ></Can>
    </>
  )
}

export default UserList
