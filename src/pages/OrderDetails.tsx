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
import { Order } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UserContext } from "@/providers/user-provider"
import { Can } from "@/components/Can"
import NoAccess from "@/components/NoAccess"

const OrderDetails = () => {
  const [comments, setComments] = useState("")
  const [status, setStatus] = useState("")
  const [address, setAddress] = useState("")

  const navigate = useNavigate()

  const { id } = useParams<{ id: string }>()
  const context = useContext(UserContext)
  const token = context?.token

  const handleDeleteOrder = async () => {
    const res = await api.delete(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    toast({
      title: "✅ Deleted!",
      className: "bg-green-100 text-black dark:bg-emerald-900 dark:text-white",
      description: `Order deleted successfully.`
    })
    navigate("/orders")
    return res.data.data
  }

  const handleEditOrder = async () => {
    const payload = {
      comments: comments,
      status: status,
      address: address
    }
    const res = await api.put(`/orders/${id}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    toast({
      title: "✅ Edited!",
      className: "bg-green-100 text-black dark:bg-emerald-900 dark:text-white",
      description: `Order edited successfully.`
    })
    navigate("/orders")
    return res.data.data
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

  useEffect(() => {
    if (order) {
      setComments(order.comments)
      setStatus(order.status)
      setAddress(order.address)
    }
  }, [order])

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
      permission="ORDER:EDIT"
      permissionType="actions"
      yes={() => (
        <>
          {isLoading && <Loading item="order" />}

          {order && (
            <div className="container mx-auto mt-5">
              <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
                Order details
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
                <Button asChild>
                  <Link to="/orders">Back to Order List</Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Edit</Button>
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
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                          Status
                        </Label>
                        <Input
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
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
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={() => {
                          if (id) {
                            handleEditOrder()
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
                        This action cannot be undone. This will permanently delete the selected
                        order and remove its data from our servers.
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
      )}
      no={() => <NoAccess />}
    />
  )
}

export default OrderDetails
