import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ShoppingCart, X } from "lucide-react"
import api from "@/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"
import { UserContext } from "@/providers/user-provider"
import { ApiErrorResponse, Cart, Product } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios, { AxiosError } from "axios"
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
import { Textarea } from "@/components/ui/textarea"
import { ToastAction } from "@/components/ui/toast"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

const ProductListCards = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState("")

  const queryClient = useQueryClient()

  const context = useContext(UserContext)
  if (!context) {
    return null
  }
  const { user, token } = context

  const handleFetchProducts = async () => {
    const res = await api.get("/products", { params: { search: searchValue } })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    return res.data.data
  }

  const {
    data: products,
    isLoading,
    isError,
    error
  } = useQuery<Product[]>({
    queryKey: ["products", searchValue],
    queryFn: handleFetchProducts
  })

  const handleSearchValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    setCurrentPage(1)
  }

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100)
  const [maxPriceFixed, setMaxPriceFixed] = useState(100)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [newAddress, setNewAddress] = useState("")
  const [comments, setComments] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const totalPages = Math.ceil((filteredProducts ? filteredProducts.length : 0) / itemsPerPage)

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = (filteredProducts || []).slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  useEffect(() => {
    if (products && products.length > 0) {
      const maxProductPrice = Math.max(...products.map((product) => product.price))
      setMaxPrice(maxProductPrice)
      setMaxPriceFixed(maxProductPrice)
    }
  }, [products])

  useEffect(() => {
    let filtered = products?.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    )

    if (availableOnly) {
      filtered = filtered?.filter((product) => product.stock > 0)
    }

    filtered = filtered?.sort((a, b) => b.rating - a.rating)

    setFilteredProducts(filtered)
  }, [minPrice, maxPrice, availableOnly, products])

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMinPrice(Number(e.target.value))
  }

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(Number(e.target.value))
  }

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: quantity
    }))
  }

  const [userCart, setUserCart] = useState<Cart | null>(null)

  const handleFetchCart = async () => {
    if (!user?.id || !token) {
      throw new Error("User or token is missing!")
    }
    const res = await api.get(`/carts/${user?.id}`, {
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
    data: cart,
    isLoading: cartLoading,
    isError: cartError,
    error: cartFetchError
  } = useQuery<Cart>({
    queryKey: ["cart", user?.id],
    queryFn: handleFetchCart,
    enabled: !!user?.id && !!token
  })

  useEffect(() => {
    if (cart) {
      setUserCart(cart)
    }
  }, [cart])

  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (cart && cart.products) {
      const totalAmount = cart.products
        .reduce((sum, item) => sum + item.product.price * item.quantity, 0)
        .toFixed(2)
      setTotal(Number(totalAmount))
    }
  }, [cart])

  const handleAddToCart = async (productId: string, quantity: number) => {
    const payload = {
      productId: productId,
      quantity: quantity,
      userId: user?.id
    }
    if (!context.user?.role) {
      navigate("/login")
      toast({
        title: "❌ Failed to Add!",
        className: "bg-red-100 text-black",
        description: `To add products to your cart, you should log in first. If you don't have an account, sign up now.`,
        action: (
          <ToastAction altText="Sign Up" className="hover:bg-gray-100">
            Ok
          </ToastAction>
        )
      })
      return
    }
    try {
      const response = await api.post(`/carts`, payload)
      if (response.status === 200) {
        toast({
          title: "✅ Added successfully!",
          className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
          description: `The product has been added to your cart.`
        })
        queryClient.invalidateQueries({ queryKey: ["cart"] })
      } else {
        toast({
          title: "❌ Failed to Add!",
          className: "bg-red-100 text-black",
          description: `There was an error adding the product to your cart. ${response.status}`
        })
      }
    } catch (error) {
      toast({
        title: "❌ Failed to Add!",
        className: "bg-red-100 text-black",
        description: `${error}`
      })
    }
  }

  const handleRemoveItem = async (cartId: string, productId: string) => {
    try {
      const response = await api.delete(`/carts/${cartId}/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 200) {
        toast({
          title: "✅ Removed successfully!",
          className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
          description: `The product has been removed from your cart.`
        })
        queryClient.invalidateQueries({ queryKey: ["cart"] })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>
        if (axiosError.response) {
          toast({
            title: "❌ Failed to Remove!",
            className: "bg-red-100 text-black",
            description: `${error}`
          })
        } else {
          toast({
            title: "❌ Failed to Remove!",
            className: "bg-red-100 text-black",
            description: error.message || "An unknown error occurred."
          })
        }
      } else {
        toast({
          title: "❌ Failed to Remove!",
          className: "bg-red-100 text-black",
          description: "An unknown error occurred."
        })
      }
    }
  }

  const handleConfirmOrder = async (
    newAddress: string,
    comments: string,
    paymentMethod: string
  ) => {
    const products = cart?.products.map((item) => item.product)
    const orderData = {
      userId: user?.id,
      dateTime: new Date().toISOString(),
      comments: comments,
      status: "PENDING",
      address: newAddress || user?.address,
      products: products
    }
    try {
      const orderResponse = await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (orderResponse.status === 201) {
        const orderId = orderResponse.data.data.id
        const paymentData = {
          orderId,
          amount: total,
          status: "PENDING",
          method: paymentMethod
        }
        const paymentResponse = await api.post("/payments", paymentData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (paymentResponse.status === 201) {
          queryClient.invalidateQueries({ queryKey: ["cart"] })
          toast({
            title: "✅ Order and Payment Successful!",
            className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
            description: `Your order has been placed successfully with payment.`
          })
        } else {
          toast({
            title: "⚠️ Order Successful, but Payment Failed",
            className: "bg-yellow-100 text-black",
            description: `Your order was placed, but the payment failed. Please try again.`
          })
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>

        if (axiosError.response) {
          toast({
            title: "❌ Order or Payment Failed!",
            className: "bg-red-100 text-black",
            description: `${axiosError.response.data.error.message}`
          })
        } else {
          toast({
            title: "❌ Order or Payment Failed!",
            className: "bg-red-100 text-black",
            description: error.message || "An unknown error occurred."
          })
        }
      } else {
        toast({
          title: "❌ Order or Payment Failed!",
          className: "bg-red-100 text-black",
          description: "An unknown error occurred."
        })
      }
    }
  }


  const [values, setValues] = useState([20, 80]); // Example default values [min, max]

  // Handle changes in slider values
  const handleChange = (newValues: number[]) => {
    setValues(newValues);
  };


  return (
    <>
      <Sheet>
        <div className="flex justify-end items-center p-4 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <div className="relative cursor-pointer flex items-center text-gray-700 hover:text-gray-900">
                    <ShoppingCart className="ml-2 w-6 h-6 dark:text-white" />
                    {(cart?.products?.length ?? 0) > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {cart?.products?.length ?? 0}
                      </span>
                    )}
                  </div>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Cart</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <SheetContent className="overflow-y-scroll">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>
              Review the products you have added to your cart. You can adjust quantities or proceed
              to checkout.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {cart?.products.map((item, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4 relative">
                <div className="col-span-1">
                  <img
                    src={item.product.images[0] || "https://placehold.co/68x68"}
                    alt={item.product.name}
                    className="w-15 h-15 object-cover rounded"
                  />
                </div>
                <div className="col-span-3">
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-gray-500">Price: €{item.product.price.toFixed(2)}</p>
                  <p className="text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-gray-500">
                    Total: €{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => handleRemoveItem(cart.cartId, item.product.id)}
                        className="absolute top-0 right-0 p-1 text-gray-500 hover:text-red-500 cursor-pointer"
                        role="button"
                        aria-label="Remove item"
                      >
                        <X className="w-5 h-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove from Cart</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
          <SheetFooter className="grid mt-5 min-h-24">
            <p className="font-semibold text-xl text-center">
              {total === 0 ? "Your cart is empty" : `Total: ${total} €`}
            </p>
            <SheetClose asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-2" disabled={total === 0}>
                    Proceed to Checkout
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Checkout</DialogTitle>
                    <DialogDescription>
                      Review your order details below. You can choose a payment method, change your
                      shipping address if needed, and add any extra instructions in the comments
                      before proceeding.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 gap-4">
                      <Label htmlFor="shippingAddress" className="text-right text-sm">
                        Shipping Address
                      </Label>
                      <Textarea
                        id="shippingAddress"
                        value={newAddress}
                        placeholder={user?.address}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <Label htmlFor="comments" className="text-right text-sm">
                        Comments
                      </Label>
                      <Textarea
                        id="comments"
                        value={comments}
                        className="col-span-3"
                        placeholder="Any special instructions?"
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="comments" className="text-right text-sm">
                        Amount
                      </Label>
                      <Input
                        id="amount"
                        defaultValue={total}
                        className="col-span-3"
                        placeholder="Any special instructions?"
                        disabled={true}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="paymentMethod" className="text-right text-sm">
                        Payment Method
                      </Label>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) => setPaymentMethod(value)}
                        className="col-span-3 flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="CREDIT_CARD" id="CREDIT_CARD" />
                          <Label htmlFor="CREDIT_CARD">Credit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="BANK_TRANSFER" id="BANK_TRANSFER" />
                          <Label htmlFor="BANK_TRANSFER">Bank Transfer</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="CASH" id="CASH" />
                          <Label htmlFor="CASH">Cash</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        onClick={() => handleConfirmOrder(newAddress, comments, paymentMethod)}
                        disabled={paymentMethod === ""}
                      >
                        Confirm Order
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <div className="p-10">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-center">
          List of all Products
        </h2>
        <h3 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight text-center mb-5">
          (Total: {filteredProducts?.length || 0} items)
        </h3>

        <div className="relative">
          <div className="">
            <div className="flex mb-5">
              <Input
                type="text"
                name="searchInput"
                value={searchValue}
                onChange={handleSearchValueChange}
                className="mb-3 text-lg basis-11/12"
                placeholder="Search for products..."
              />
              <Button
                variant="link"
                className="basis-1/12 ml-3"
                onClick={() => {
                  setSearchValue("")
                }}
              >
                Reset
              </Button>
            </div>
            <div>
      
    </div>
            <div className="flex mb-5">
              <p className="text-lg basis-3/12 mt-1 ml-2">
                Price Range: € {minPrice} - € {maxPrice}
              </p>
              <Input
                type="number"
                name="min"
                value={minPrice}
                min={0}
                max={maxPrice - 1}
                onChange={handleMinPriceChange}
                className="mb-3 text-lg basis-4/12"
                placeholder="Min"
              />
              <p className="m-2"> to </p>
              <Input
                type="number"
                name="max"
                max={maxPriceFixed}
                min={minPrice + 1}
                value={maxPrice}
                onChange={handleMaxPriceChange}
                className="mb-3 text-lg basis-4/12"
                placeholder="Max"
              />
              <Button
                variant="link"
                className="ml-3 basis-1/12"
                onClick={() => {
                  setMinPrice(0)
                  setMaxPrice(maxPriceFixed)
                }}
              >
                Reset
              </Button>
            </div>
            <div className="flex mb-5">
              <RadioGroup defaultValue="showAllItems" className="flex mb-5">
                <div className="flex items-center space-x-2 mr-2">
                  <RadioGroupItem
                    value="showAllItems"
                    id="r1"
                    onClick={() => {
                      setAvailableOnly(false)
                    }}
                  />
                  <Label htmlFor="r1">Show All Items</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="availableItemsOnly"
                    id="r2"
                    onClick={() => {
                      setAvailableOnly(true)
                    }}
                  />
                  <Label htmlFor="r2">Available Items Only</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-10">
          {isLoading && (
            <div className="col-span-3 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
              <p className="ml-4 text-blue-500 font-semibold">Loading products...</p>
            </div>
          )}
          {isError && (
            <div className="col-span-3 text-center text-red-500 font-semibold">
              <p>Error: {error instanceof Error ? error.message : "An error occurred"}</p>
            </div>
          )}
        </div>
      </div>

      {currentProducts.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 p-10">
          {currentProducts.map((product) => (
            <Card key={product.id}>
              <Link to={`/products/${product.id}`}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>€ {product.price.toFixed(2)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded"
                  />
                  <p>Rating: {product.rating}</p>
                </CardContent>
              </Link>
              <CardFooter className="flex flex-col items-start space-y-2">
                {product.stock > 0 ? (
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      value={quantities[product.id] || 1}
                      min={1}
                      max={product.stock}
                      onChange={(e) => handleQuantityChange(product.id, Number(e.target.value))}
                      className="w-16"
                      placeholder="Qty"
                    />
                    <Button
                      onClick={() => handleAddToCart(product.id, quantities[product.id] || 1)}
                    >
                      Add to cart
                    </Button>
                  </div>
                ) : (
                  <Button variant={"secondary"} className="text-gray-400">
                    Not Available
                  </Button>
                )}

                {quantities[product.id] === product.stock && (
                  <p className="text-sm text-red-400">No more items available</p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p>No products available.</p>
      )}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  isActive={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}

export default ProductListCards
