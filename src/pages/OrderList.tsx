import api from "@/api"
import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { convertArrayTimestampToDateTimeFormat } from "@/lib/dateUtility"
import { UserContext } from "@/providers/user-provider"
import { orderSchema } from "@/schemas/order"
import { AddOrder, ApiErrorResponse, Order, Product } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Plus } from "lucide-react"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ZodIssue } from "zod"

const OrderList = () => {
  enum OrderStatus {
    Pending = "PENDING",
    Shipped = "SHIPPED",
    Delivered = "DELIVERED",
    Cancelled = "CANCELLED"
  }
  const [userId, setUserId] = useState("")
  // const [dateTime, setDateTime] = useState<number[]>([])
  const [dateTime, setDateTime] = useState("")
  const [comments, setComments] = useState("")
  const [status, setStatus] = useState("")
  const [address, setAddress] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [validationErrors, setValidationErrors] = useState<ZodIssue[]>([])
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const handleAddOrder = async (addOrder: AddOrder) => {
    console.log("addOrder", addOrder)
    const result = orderSchema.safeParse(addOrder)

    if (!result.success) {
      setValidationErrors(result.error.errors)
    } else {
      setValidationErrors([])

      try {
        const res = await api.post(`/orders`, addOrder)
        if (res.status == 200) {
          toast({
            title: "✅ Added!",
            className: "bg-green-100 text-black",
            description: `Order added successfully.`
          })
          queryClient.invalidateQueries({ queryKey: ["orders"] })
          setOpen(false)
          return res.data.data
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiErrorResponse>
          if (axiosError.response) {
            toast({
              title: "❌ Adding order failed!",
              className: "bg-red-100 text-black",
              description: `${axiosError.response.data.error.message}`
            })
          } else {
            toast({
              title: "❌ Adding order failed!",
              className: "bg-red-100 text-black",
              description: error.message || "An unknown error occurred."
            })
          }
        } else {
          toast({
            title: "❌ Adding order failed!",
            className: "bg-red-100 text-black",
            description: "An unknown error occurred."
          })
        }
      }
    }
  }

  const navigate = useNavigate()
  const context = useContext(UserContext)
  const token = context?.token
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
    queryFn: handleFetchOrders
  })

  {
    isError && (
      <div className="col-span-3 text-center text-red-500 font-semibold">
        <p>Error: {error instanceof Error ? error.message : "An error occurred"}</p>
      </div>
    )
  }

  const errorsAsObject = validationErrors.reduce((validationErrors, validationError) => {
    return {
      ...validationErrors,
      [validationError.path[0]]: validationError.message
    }
  }, {} as { [key: string]: string })

  const handleReset = () => {
    setUserId("")
    setDateTime("")
    setComments("")
    setStatus("")
    setAddress("")
    setProducts([])
  }

  return (
    <div className="grid items-center justify-center">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
        List of all Orders
      </h2>
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="grid items-center justify-center my-5">
          <DialogTrigger asChild>
            <Button onClick={handleReset}>
              <Plus className="mr-4" />
              Add Order
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Order</DialogTitle>
            <DialogDescription>
              Enter the new Order&apos;s information here. Click Add when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="userId" className="text-right">
                User ID *
              </Label>
              <Input
                id="userId"
                name="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="col-span-3"
              />
            </div>
            {errorsAsObject["userId"] && <p className="text-red-400">{errorsAsObject["userId"]}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateTime" className="text-right">
                Date & Time
              </Label>
              <Input
                id="dateTime"
                name="dateTime"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                className="col-span-3"
                type="text"
              />
            </div>
            {/* {errorsAsObject["dateTime"] && (
              <p className="text-red-400">{errorsAsObject["dateTime"]}</p>
            )} */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comments" className="text-right">
                Comments
              </Label>
              <Input
                id="comments"
                name="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status *
              </Label>
              <Select name="status" onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Set Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={OrderStatus.Pending}>Pending</SelectItem>
                    <SelectItem value={OrderStatus.Shipped}>Shipped</SelectItem>
                    <SelectItem value={OrderStatus.Delivered}>Delivered</SelectItem>
                    <SelectItem value={OrderStatus.Cancelled}>Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* {errorsAsObject["status"] && <p className="text-red-400">{errorsAsObject["status"]}</p>} */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address *
              </Label>
              <Input
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="col-span-3"
              />
            </div>
            {/* {errorsAsObject["address"] && <p className="text-red-400">{errorsAsObject["address"]}</p>} */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="products" className="text-right">
                Products *
              </Label>
              <Input
                id="products"
                name="products"
                // value={products}
                // onChange={(e) => setProducts([{"id":e.target.value}])}
                className="col-span-3"
              />
            </div>
          </div>
          {/* {errorsAsObject["products"] && (
              <p className="text-red-400">{errorsAsObject["products"]}</p>
            )} */}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                handleAddOrder({
                  userId,
                  dateTime,
                  comments,
                  status,
                  address,

                  products: [
                    {
                      id: "dcaa3927-fc91-423b-8afa-ce3c200001b4",
                      name: "Fun Pattern Crew Socks",
                      price: 9.99,
                      description:
                        "1 Pair Of Men's Cotton Blend Fashion Novel Fun Pattern Crew Socks, Soft & Lightweight All-match Unisex Socks, For Gifts, Outdoor Wearing & All Seasons Wearing",
                      images: [
                        "https://img.kwcdn.com/product/fancy/c41cfa3a-a8bf-4bed-abbe-8d33289dde34.jpg?imageView2/2/w/800/q/70/format/webp"
                      ],
                      color: "Green",
                      meta: null,
                      rating: 4.5,
                      stock: 100
                    }
                  ]
                })
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
