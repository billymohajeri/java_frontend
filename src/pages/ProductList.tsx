import api from "@/api"
import { Can } from "@/components/Can"
import Loading from "@/components/Loading"
import NoAccess from "@/components/NoAccess"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

const ProductList = () => {
  const navigate = useNavigate()
  const handleProductPageRender = () => {
    const handleFetchProducts = async () => {
      let token = ""
      const user = localStorage.getItem("currentUserData")
      if (user) {
        try {
          const objUser = JSON.parse(user)
          const tokenWithQuotes = objUser?.token || null
          token = tokenWithQuotes?.replace(/"/g, "")
        } catch (error) {
          console.error("Failed to parse user data:", error)
        }
      }
      const res = await api.get("/products", {
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
      data: products,
      isLoading,
      isError,
      error
    } = useQuery<Product[]>({
      queryKey: ["users"],
      queryFn: handleFetchProducts
    })

    {
      isError && (
        <div className="col-span-3 text-center text-red-500 font-semibold">
          <p>Error: {error instanceof Error ? error.message : "An error occurred"}</p>
        </div>
      )
    }

    return (
      <div className="grid items-center justify-center">
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
          List of all products
        </h2>
        {isLoading && <Loading item="products" />}
        <Table className="">
          <TableCaption>Click on each item to see details and more actions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="cursor-pointer"
              >
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell>{product.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }
  return (
    <>
      <Can
        permission="PRODUCT:GET"
        permissionType="actions"
        yes={() => handleProductPageRender()}
        no={() => <NoAccess />}
      ></Can>
    </>
  )
}

export default ProductList
