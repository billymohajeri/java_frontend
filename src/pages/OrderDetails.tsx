import { useContext, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import api from "@/api"
import NotFound from "./NotFound"
import Loading from "@/components/Loading"
import NoAccess from "@/components/NoAccess"
import { ApiErrorResponse, Order } from "@/types"
import { UserContext } from "@/providers/user-provider"

import { ZodIssue } from "zod"
import axios, { AxiosError } from "axios"
import { orderSchema } from "@/schemas/order"

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
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

const OrderDetails = () => {
  const [comments, setComments] = useState("")
  const [status, setStatus] = useState("")
  const [address, setAddress] = useState("")
  const [validationErrors, setValidationErrors] = useState<ZodIssue[]>([])
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const context = useContext(UserContext)
  const token = context?.token
  const role = context?.user?.role

  const handleDeleteOrder = async () => {
    try {
      const res = await api.delete(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status === 200) {
        toast({
          title: "✅ Deleted!",
          className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
          description: `Order deleted successfully.`
        })
        navigate("/orders")
        return res.data.data
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>
        if (axiosError.response) {
          toast({
            title: "❌ Deleting Order failed!",
            className: "bg-red-100 text-black",
            description: `${axiosError.response.data.error.message}`
          })
        } else {
          toast({
            title: "❌ Deleting Order failed!",
            className: "bg-red-100 text-black",
            description: error.message || "An unknown error occurred."
          })
        }
      } else {
        toast({
          title: "❌ Deleting Order failed!",
          className: "bg-red-100 text-black",
          description: "An unknown error occurred."
        })
      }
    }
  }
  const handleEditOrder = async () => {
    const payload = {
      comments: comments,
      status: status,
      address: address
    }
    const result = orderSchema.safeParse(payload)
    if (!result.success) {
      setValidationErrors(result.error.errors)
    } else {
      setValidationErrors([])
      try {
        const res = await api.put(`/orders/${id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (res.status === 200) {
          toast({
            title: "✅ Edited!",
            className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
            description: `Order edited successfully.`
          })
          queryClient.invalidateQueries({ queryKey: ["order"] })
          setOpen(false)
        }
        return res.data.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiErrorResponse>
          if (axiosError.response) {
            toast({
              title: "❌ Editing Order failed!",
              className: "bg-red-100 text-black",
              description: `${axiosError.response.data.error.message}`
            })
          } else {
            toast({
              title: "❌ Editing Order failed!",
              className: "bg-red-100 text-black",
              description: error.message || "An unknown error occurred."
            })
          }
        } else {
          toast({
            title: "❌ Editing Order failed!",
            className: "bg-red-100 text-black",
            description: "An unknown error occurred."
          })
        }
      }
    }
  }

  const handleFetchOrder = async () => {
    const res = await api.get(`/orders/${id}`, {
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
    data: order,
    isLoading,
    isError,
    error
  } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: handleFetchOrder,
    enabled: context?.user?.role === "ADMIN"
  })

  if (isError) {
    return (
      <>
        <div>{error.message.includes("404") && <NotFound />}</div>
        <div className="flex justify-center items-center mt-12">
          <p className="text-red-500 font-semibold">
            Error: {error?.message || "Unable to fetch order details"}
          </p>
        </div>
      </>
    )
  }

  const errorsAsObject = validationErrors.reduce((validationErrors, validationError) => {
    return {
      ...validationErrors,
      [validationError.path[0]]: validationError.message
    }
  }, {} as { [key: string]: string })

  const handleReset = () => {
    setValidationErrors([])
    if (order) {
      setComments(order.comments)
      setStatus(order.status)
      setAddress(order.address)
    }
  }

  return (
    <>
      {isLoading && <Loading item="order" />}

      {(!token || role === "USER") && <NoAccess />}

      {order && (
        <div className="container mx-auto mt-5">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-center mb-5 mt-24">
            Order Details
          </h2>
          <div className="bg-white shadow-md rounded-lg p-5">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mt-4 md:mt-0 md:ml-4">
                <div className="p-4">
                  <p className="text-gray-700 mb-2">
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>User ID:</strong> {order.userId}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Date & Time:</strong> {order.dateTime}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Comments:</strong> {order.comments}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Address:</strong> {order.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild variant="secondary">
              <Link to="/orders">Back to Order List</Link>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" onClick={handleReset}>
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit order</DialogTitle>
                  <DialogDescription>
                    Make changes to this order here. Click save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="comments" className="text-right">
                      Comments
                    </Label>
                    <Input
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  {errorsAsObject["comments"] && (
                    <p className="text-red-400">{errorsAsObject["comments"]}</p>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status *
                    </Label>
                    <Select
                      name="status"
                      onValueChange={(value) => setStatus(value)}
                      defaultValue={order.status}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="SHIPPED">Shipped</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELED">Canceled</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errorsAsObject["status"] && (
                    <p className="text-red-400">{errorsAsObject["status"]}</p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                {errorsAsObject["address"] && (
                  <p className="text-red-400">{errorsAsObject["address"]}</p>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>

                  <Button
                    onClick={handleEditOrder}
                    disabled={
                      comments === order.comments &&
                      status === order.status &&
                      address === order.address
                    }
                  >
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the selected order
                    and remove its data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteOrder}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </>
  )
}

export default OrderDetails
