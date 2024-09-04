import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ShoppingCart, X } from "lucide-react"
import api from "@/api"
import PaginationComponent from "@/components/PaginationComponent"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
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
import { Cart, Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"

const ProductListCards = () => {
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

  const context = useContext(UserContext)
  if (!context) {
    return null
  }
  const { user, logout, token } = context

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

  const handleCurrentPageChange = (page: number) => {
    setCurrentPage(page)
  }

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(100)
  const [maxPriceFixed, setMaxPriceFixed] = useState(100)
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState("")

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

  const handleAddToCart = async (productId: string, quantity: number) => {
    const payload = {
      productId: productId,
      quantity: quantity,
      userId: user?.id
    }
    try {
      const response = await api.post(`/carts`, payload)
      if (response.status === 200) {
        toast({
          title: "✅ Added successfully!",
          className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
          description: `The product has been added to your cart.`
        })
        console.log(response.data.data)
      } else {
        toast({
          title: "❌ Failed to Add!",
          className: "bg-red-100 text-black",
          description: `There was an error adding the product to your cart. ${response.status}`
        })
      }
    } catch (error) {
      toast({
        title: "❌ Login failed!",
        className: "bg-red-100 text-black",
        description: `${error}`
      })
    }
  }

  const handleRemoveItem = async (cartId: string, productId: string) => {
    console.log(`${productId} Removed`)
  }
  return (
    <>
      <Sheet>
        <div className="flex justify-end items-center p-4 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <div className="relative cursor-pointer flex items-center text-gray-700 hover:text-gray-900">
                    <ShoppingCart className="ml-2 w-6 h-6" />
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
                    className="w-15 h-15 object-cover"
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
          <SheetFooter className="grid mt-5">
            <p className="font-semibold text-xl text-center">
              Total: €
              {cart?.products
                .reduce((total, item) => total + item.product.price * item.quantity, 0)
                .toFixed(2)}
            </p>
            <Button className="mt-2">Proceed to Checkout</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <div className="p-10">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center">
          List of all Products
        </h2>
        <h3 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-center mb-5">
          (Total: {filteredProducts?.length} items)
        </h3>
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
          {filteredProducts?.map((product) => (
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
                    className="w-full h-32 object-cover"
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
        <PaginationComponent
          totalPages={5}
          currentPage={currentPage}
          handleCurrentPageChange={handleCurrentPageChange}
        />
      </div>
    </>
  )
}

export default ProductListCards
