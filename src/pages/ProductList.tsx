import api from "@/api"
import { Can } from "@/components/Can"
import Loading from "@/components/Loading"
import NoAccess from "@/components/NoAccess"
import { productSchema } from "@/schemas/product"
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { UserContext } from "@/providers/user-provider"
import { AddProduct, Product } from "@/types"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { Plus } from "lucide-react"

import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ZodIssue } from "zod"

const ProductList = () => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [color, setColor] = useState("")
  const [rating, setRating] = useState(0)
  const [stock, setStock] = useState(0)

  const [validationErrors, setValidationErrors] = useState<ZodIssue[]>([])
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  interface ApiErrorResponse {
    error: {
      message: string
    }
  }

  const context = useContext(UserContext)
  const token = context?.token
  const navigate = useNavigate()

  const handleProductPageRender = () => {
    const handleFetchProducts = async () => {
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
      queryKey: ["products"],
      queryFn: handleFetchProducts,
      enabled: context?.user?.role === "ADMIN"
    })

    {
      isError && (
        <div className="col-span-3 text-center text-red-500 font-semibold">
          <p>Error: {error instanceof Error ? error.message : "An error occurred"}</p>
        </div>
      )
    }

    const handleAddProduct = async (addProduct: AddProduct) => {
      const result = productSchema.safeParse(addProduct)

      if (!result.success) {
        setValidationErrors(result.error.errors)
      } else {
        setValidationErrors([])
        try {
          const res = await api.post(`/products`, addProduct, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          if (res.status == 200) {
            toast({
              title: "✅ Added!",
              className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
              description: `Product "${res.data.data.name}" added successfully.`
            })
            queryClient.invalidateQueries({ queryKey: ["products"] })

            setOpen(false)
            return res.data.data
          }
        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ApiErrorResponse>
            if (axiosError.response) {
              toast({
                title: "❌ Adding product failed!",
                className: "bg-red-100 text-black",
                description: `${axiosError.response.data.error.message}`
              })
            } else {
              toast({
                title: "❌ Adding product failed!",
                className: "bg-red-100 text-black",
                description: error.message || "An unknown error occurred."
              })
            }
          } else {
            toast({
              title: "❌ Adding product failed!",
              className: "bg-red-100 text-black",
              description: "An unknown error occurred."
            })
          }
        }
      }
    }

    const errorsAsObject = validationErrors.reduce((validationErrors, validationError) => {
      return {
        ...validationErrors,
        [validationError.path[0]]: validationError.message
      }
    }, {} as { [key: string]: string })

    const handleReset = () => {
      setName("")
      setPrice(0)
      setDescription("")
      setImages([])
      setColor("")
      setRating(0)
      setStock(0)
    }

    return (
      <div className="grid items-center justify-center">
        <h2 className="text-3xl font-semibold tracking-tight text-center">List of all Products</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="grid items-center justify-center my-5">
            <DialogTrigger asChild>
              <Button onClick={handleReset}>
                <Plus className="mr-4" />
                Add Product
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add product</DialogTitle>
              <DialogDescription>
                Enter the new product&apos;s information here. Click Add when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {errorsAsObject["name"] && <p className="text-red-400">{errorsAsObject["name"]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price *
                </Label>
                <Input
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value))}
                  className="col-span-3"
                  type="number"
                  min="0"
                />
              </div>
              {errorsAsObject["price"] && <p className="text-red-400">{errorsAsObject["price"]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="images" className="text-right">
                  Images
                </Label>
                <Input
                  id="images"
                  name="images"
                  value={images}
                  onChange={(e) => setImages(e.target.value !== "" ? [e.target.value] : [])}
                  className="col-span-3"
                  type="url"
                />
              </div>
              {errorsAsObject["images"] && (
                <p className="text-red-400">{errorsAsObject["images"]}</p>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="color" className="text-right">
                  Color *
                </Label>
                <Input
                  id="color"
                  name="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="col-span-3"
                />
              </div>
              {errorsAsObject["color"] && <p className="text-red-400">{errorsAsObject["color"]}</p>}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Rating
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="col-span-3"
                  type="number"
                  min="0"
                />
              </div>
              {errorsAsObject["rating"] && (
                <p className="text-red-400">{errorsAsObject["rating"]}</p>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock *
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value))}
                  className="col-span-3"
                  type="number"
                  min="0"
                />
              </div>
              {errorsAsObject["stock"] && <p className="text-red-400">{errorsAsObject["stock"]}</p>}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={() => {
                  handleAddProduct({
                    name,
                    price,
                    description,
                    images,
                    color,
                    rating,
                    stock
                  })
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading && <Loading item="products" />}
        <Table className="">
          <TableCaption>Click on each item to see details and more actions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product, index) => (
              <TableRow
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className="cursor-pointer"
              >
                <TableCell>{index + 1}</TableCell>
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
        permission="PRODUCT:EDIT"
        permissionType="actions"
        yes={() => handleProductPageRender()}
        no={() => <NoAccess />}
      ></Can>
    </>
  )
}

export default ProductList
