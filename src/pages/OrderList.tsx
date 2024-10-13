import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import api from "@/api"
import { Loading } from "@/components/Loading"
import NoAccess from "@/components/NoAccess"
import ShowError from "@/components/ShowError"
import { UserContext } from "@/providers/user-provider"
import { Order } from "@/types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

const OrderList = () => {
  const navigate = useNavigate()
  const context = useContext(UserContext)
  const token = context?.token
  const role = context?.user?.role

  const handleFetchOrders = async () => {
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
    queryKey: ["orders"],
    queryFn: handleFetchOrders,
    enabled: context?.user?.role === "ADMIN"
  })

  return (
    <>
      {isLoading && <Loading item="Orders" />}

      {isError && <ShowError resourceName="Orders List" errorMessage={error.message} />}

      {(!token || role === "USER") && <NoAccess />}

      {orders?.length && (
        <div className="grid items-center justify-center p-10">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-center mt-24">
            List of all Orders
          </h2>
          <h3 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-center mb-5">
            (Total: {orders?.length || 0} orders)
          </h3>
          <h4 className="text-center text-sm text-gray-400 mb-5">
            Click on each item to see details and more actions.
          </h4>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

export default OrderList
