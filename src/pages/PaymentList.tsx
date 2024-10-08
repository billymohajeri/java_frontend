import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"

import api from "@/api"
import { Payment } from "@/types"
import {Loading} from "@/components/Loading"
import NoAccess from "@/components/NoAccess"
import { UserContext } from "@/providers/user-provider"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import ShowError from "@/components/ShowError"

const PaymentList = () => {
  const navigate = useNavigate()
  const context = useContext(UserContext)
  const token = context?.token
  const role = context?.user?.role

  const handleFetchPayments = async () => {
    const token = context?.token
    const res = await api.get("/payments", {
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
    data: payments,
    isLoading,
    isError,
    error
  } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: handleFetchPayments,
    enabled: context?.user?.role === "ADMIN"
  })

  return (
    <>
      {isLoading && <Loading item="Payments" />}

      {isError && <ShowError resourceName="Payments List" errorMessage={error.message} />}

      {(!token || role === "USER") && <NoAccess />}

      {payments?.length && (
        <div className="grid items-center justify-center p-10">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-center mt-24">
            List of all Payments
          </h2>
          <h3 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-center mb-5">
            (Total: {payments?.length || 0} payments)
          </h3>
          <h4 className="text-center text-sm text-gray-400 mb-5">
            Click on each item to see details and more actions.
          </h4>

          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment, index) => (
                <TableRow
                  key={payment.id}
                  onClick={() => navigate(`/payments/${payment.id}`)}
                  className="cursor-pointer"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.orderId}</TableCell>
                  <TableCell>{payment.amount}</TableCell>
                  <TableCell>{payment.status}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}

export default PaymentList
