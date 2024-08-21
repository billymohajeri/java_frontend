import api from "@/api"
import { Can } from "@/components/Can"
import { Button } from "@/components/ui/button"
import { Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>()

  const handleFetchProduct = async () => {
    const res = await api.get(`/products/${id}`)
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    return res.data.data
  }

  const {
    data: product,
    isLoading,
    isError,
    error
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: handleFetchProduct
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-blue-500 font-semibold">Loading product...</p>
      </div>
    )
  }

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
    <>
      {product && (
        <div className="container mx-auto mt-5">
          <div className="bg-white shadow-md rounded-lg p-5">
            <div className="flex flex-col md:flex-row">
              {product.images && (
                <div className="md:w-1/3">
                  <img
                    src={product.images[0]}
                    className="w-full h-auto object-cover rounded-lg"
                    alt={product.name}
                  />
                </div>
              )}
              <div className="md:w-2/3 mt-4 md:mt-0 md:ml-4">
                <div className="p-4">
                  <h5 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h5>
                  <p className="text-gray-700 mb-2">
                    <strong>Price:</strong> ${product.price}
                  </p>
                  <p className="text-gray-700 mb-2">{product.description}</p>
                  <p className="text-gray-700 mb-2">{product.color}</p>
                  <div className="text-gray-700 mb-2">
                    {product.stock > 0 ? (
                      <p>{product.stock} left</p>
                    ) : (
                      <p className="text-red-500">Out of stock</p>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">
                    <small>Product ID: {product.id}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Can
              permission="PRODUCT:EDIT"
              permissionType="actions"
              yes={() => (
                <Button asChild>
                  <Link to={`/products/${product.id}`}>Edit Product</Link>
                </Button>
              )}
            ></Can>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductDetails
