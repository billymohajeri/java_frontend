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

export function Home() {
  const handleFetchProducts = async () => {
    const res = await api.get("/products")
    if (res.status !== 200) {
      throw Error("Something went wrong!")
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
        {isLoading && <p>Loading...</p>}
        {isError && <p>{error.message}</p>}
        {products?.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{product.rating}</p>
            </CardContent>
            <CardFooter>
              <p>{product.stock} left</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
