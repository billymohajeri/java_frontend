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
import { Order, User } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const OrderList = () => {
  const navigate = useNavigate()

  const handleFetchOrders = async () => {
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
    const res = await api.get("/orders", {
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
    data: orders,
    isLoading,
    isError,
    error
  } = useQuery<Order[]>({
    queryKey: ["users"],
    queryFn: handleFetchOrders
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
        List of all orders
      </h2>

      {isLoading && <Loading item="orders" />}

      <Table className="">
        <TableCaption>Click on each item to see details and more actions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>User ID</TableHead>
            {/* <TableHead>Date & Time</TableHead> */}
            {/* <TableHead>Comments</TableHead> */}
            <TableHead>Status</TableHead>
            {/* <TableHead>Address</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order, index) => (
            <TableRow
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="cursor-pointer"
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.userId}</TableCell>
              {/* <TableCell>{order.dateTime.join(".")}</TableCell>
              <TableCell>{order.comments}</TableCell> */}
              <TableCell>{order.status}</TableCell>
              {/* <TableCell>{order.address}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default OrderList
