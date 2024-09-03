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
import { Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { ChangeEvent, useEffect, useState } from "react"
import { Link } from "react-router-dom"

const ProductListCards = () => {
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 10

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

  return (
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
                <p>Rating: {product.rating}</p>
              </CardContent>
            </Link>
            <CardFooter>
              {product.stock > 0 ? (
                <Button>Add to cart</Button>
              ) : (
                <Button variant={"secondary"} className="text-gray-400">
                  Not Available
                </Button>
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
  )
}

export default ProductListCards
