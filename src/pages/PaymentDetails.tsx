import { useContext, useEffect, useState } from "react"
import api from "@/api"

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
import { Payment } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { UserContext } from "@/providers/user-provider"

const PaymentDetails = () => {
  const [amount, setAmount] = useState(0)
  const [status, setStatus] = useState("")
  const [method, setMethod] = useState("")

  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const context = useContext(UserContext)
  const token = context?.token

  const handleDeletePayment = async () => {
    const res = await api.delete(`/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    toast({
      title: "✅ Deleted!",
      description: `Payment deleted successfully.`
    })
    navigate("/payments")
    return res.data.data
  }

  const handleEditPayment = async () => {
    const payload = {
      amount: amount,
      status: status,
      method: method
    }
    const res = await api.put(`/payments/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    toast({
      title: "✅ Edited!",
      description: `Payment edited successfully.`
    })
    navigate("/payments")
    return res.data.data
  }

  const handleFetchPayment = async () => {
    const res = await api.get(`/payments/${id}`, {
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
    data: payment,
    isLoading,
    isError,
    error
  } = useQuery<Payment>({
    queryKey: ["payment", id],
    queryFn: handleFetchPayment
  })

  useEffect(() => {
    if (payment) {
      setAmount(payment.amount)
      setStatus(payment.status)
      setMethod(payment.method)
    }
  }, [payment])

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">
          Error: {error?.message || "Unable to fetch product details"}
        </p>
      </div>
    )
  }

  const paymentMethod = ["CREDIT_CARD", "BANK_TRANSFER", "CASH"]
  const paymentStatus = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"]

  return (
    <>
      {isLoading && <Loading item="payment" />}

      {payment && (
        <div className="container mx-auto mt-5">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
            Payment details
          </h2>
          <div className="bg-white shadow-md rounded-lg p-5">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mt-4 md:mt-0 md:ml-4">
                <div className="p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Payment ID:</strong> {payment.id}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Order ID:</strong> {payment.orderId}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Amount:</strong> {payment.amount}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Method:</strong> {payment.method}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Status:</strong> {payment.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild>
              <Link to="/payments">Back to Payment List</Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Edit</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit payment</DialogTitle>
                  <DialogDescription>
                    Make changes to this payment here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">
                      Amount
                    </Label>
                    <Input
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select onValueChange={(value) => setStatus(value)}>
                      <SelectTrigger id="status" className="col-span-3">
                        <SelectValue placeholder={status} />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatus.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="col-span-3 hover:bg-gray-200 hover:text-gray-800"
                          >
                            {status.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="method" className="text-right">
                      Method
                    </Label>
                    <Select onValueChange={(value) => setMethod(value)}>
                      <SelectTrigger id="method" className="col-span-3">
                        <SelectValue placeholder={method} />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethod.map((method) => (
                          <SelectItem
                            key={method}
                            value={method}
                            className="col-span-3  hover:bg-gray-200 hover:text-gray-800"
                          >
                            {method.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                        handleEditPayment()
                      }
                    }}
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the selected payment
                    and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePayment}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </>
  )
}

export default PaymentDetails
