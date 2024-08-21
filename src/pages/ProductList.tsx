import api from "@/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"

const ProductList = () => {
  const handleFetchProducts = async () => {
    const res = await api.get("/products")
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
    queryKey: ["products"],
    queryFn: handleFetchProducts
  })

  return (
    <div className="p-10">
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
          <Link key={product.id} to={`/products/${product.id}`}>
            <Card key={product.id}>
              <CardHeader>
                {/* <Link to={`/products/${product.id}`}> */}
                <CardTitle>{product.name}</CardTitle>
                {/* </Link> */}
                <CardDescription>${product.price.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Rating: {product.rating}</p>
              </CardContent>
              <CardFooter>
                {product.stock > 0 ? (
                  <p>{product.stock} left</p>
                ) : (
                  <p className="text-red-500">Out of stock</p>
                )}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ProductList
