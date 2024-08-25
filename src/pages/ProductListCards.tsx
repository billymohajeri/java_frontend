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
import { Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { ChangeEvent, useState } from "react"
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

  const handleSearchValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    setCurrentPage(1)
  }

  const handleCurrentPageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="p-10">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
        List of all products
      </h2>
      <Input
        type="text"
        name="searchInput"
        value={searchValue}
        onChange={handleSearchValueChange}
        className="mb-3"
        placeholder="Search for products..."
      />
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
        {products?.map((product) => (
          <Card key={product.id}>
            <Link to={`/products/${product.id}`}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Rating: {product.rating}</p>
              </CardContent>
            </Link>
            <CardFooter>
              <Button>Add to cart</Button>
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
