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
import { Payment } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"

const PaymentList = () => {
  const navigate = useNavigate()
  const context = useContext(UserContext)
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
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
          List of all payments
        </h2>

        {isLoading && <Loading item="payments" />}

        <Table className="">
          <TableCaption>Click on each item to see details and more actions.</TableCaption>
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
    </>
  )
}

export default PaymentList
