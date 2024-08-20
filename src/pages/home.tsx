import api from "@/api"
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
    <div className="flex flex-col justify-center items-center gap-10 h-screen">
      {isLoading && <p>Loading...</p>}
      {isError && <p>{error.message}</p>}
      {products?.map((product) => (
        <div key={product.id}>
          <h3>{product.name}</h3>
        </div>
      ))}
    </div>
  )
}
