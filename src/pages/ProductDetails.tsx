import api from "@/api"
import { ZodIssue } from "zod"
import { Button } from "@/components/ui/button"
import { ApiErrorResponse, Product } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
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
import { toast } from "@/components/ui/use-toast"
import { useContext, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UserContext } from "@/providers/user-provider"
import axios, { AxiosError } from "axios"
import NotFound from "./NotFound"
import { productSchema } from "@/schemas/product"
import { Can } from "@/components/Can"

const ProductDetails = () => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [color, setColor] = useState("")
  const [rating, setRating] = useState(0)
  const [stock, setStock] = useState(0)
  const [meta, setMeta] = useState("")
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ZodIssue[]>([])
  const queryClient = useQueryClient()

  const context = useContext(UserContext)
  const token = context?.token

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

  const handleDeleteProduct = async () => {
    const res = await api.delete(`/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    toast({
      title: "✅ Deleted!",
      className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
      description: `Product "${res.data.data.name}" deleted successfully.`
    })
    navigate("/products")
    return res.data.data
  }

  const handleEditProduct = async () => {
    const payload = {
      id: id,
      name: name,
      price: price,
      description: description,
      images: images,
      color: color,
      rating: rating,
      stock: stock
    }
    const result = productSchema.safeParse(payload)
    if (!result.success) {
      setValidationErrors(result.error.errors)
    } else {
      setValidationErrors([])
      try {
        const res = await api.put(`/products`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if (res.status === 200) {
          toast({
            title: "✅ Edited!",
            className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
            description: `Product "${res.data.data.name}" edited successfully.`
          })
          queryClient.invalidateQueries({ queryKey: ["product"] })
          setOpen(false)
        }
        return res.data.data
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ApiErrorResponse>
          if (axiosError.response) {
            toast({
              title: "❌ Editing Product failed!",
              className: "bg-red-100 text-black",
              description: `${axiosError.response.data.error.message}`
            })
          } else {
            toast({
              title: "❌ Editing Product failed!",
              className: "bg-red-100 text-black",
              description: error.message || "An unknown error occurred."
            })
          }
        } else {
          toast({
            title: "❌ Editing Product failed!",
            className: "bg-red-100 text-black",
            description: "An unknown error occurred."
          })
        }
      }
    }
  }

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
      <>
        <div>{error.message.includes("404") && <NotFound />}</div>
        <div className="flex justify-center items-center mt-12">
          <p className="text-red-500 font-semibold">
            Error: {error?.message || "Unable to fetch product details"}
          </p>
        </div>
      </>
    )
  }

  const errorsAsObject = validationErrors.reduce((validationErrors, validationError) => {
    return {
      ...validationErrors,
      [validationError.path[0]]: validationError.message
    }
  }, {} as { [key: string]: string })

  const handleReset = () => {
    setValidationErrors([])
    if (product) {
      setName(product.name)
      setPrice(product.price)
      setDescription(product.description)
      setImages(product.images)
      setColor(product.color)
      setRating(product.rating)
      setStock(product.stock)
    }
  }

  return (
    <>
      {product && (
        <div className="container mx-auto mt-5">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight text-center mb-5 mt-24">
            Product Details
          </h2>
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
                    <strong>Price:</strong> €{product.price}
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
            <Button asChild variant="secondary">
              {context?.user?.role === "ADMIN" ? (
                <Link to="/products">Back to Product List</Link>
              ) : (
                <Link to="/">Back to Product List</Link>
              )}
            </Button>

            <Can
              permission="PRODUCT:EDIT"
              permissionType="actions"
              yes={() => (
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" onClick={handleReset}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit product</DialogTitle>
                      <DialogDescription>
                        Make changes to this product here. Click save when you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name *
                        </Label>
                        <Input
                          id="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      {errorsAsObject["name"] && (
                        <p className="text-red-400">{errorsAsObject["name"]}</p>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price *
                        </Label>
                        <Input
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                          className="col-span-3"
                          type="number"
                          min="0"
                        />
                      </div>
                      {errorsAsObject["price"] && (
                        <p className="text-red-400">{errorsAsObject["price"]}</p>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Input
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="images" className="text-right">
                        Images
                      </Label>
                      <Input
                        id="images"
                        value={images.join(",")}
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
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    {errorsAsObject["color"] && (
                      <p className="text-red-400">{errorsAsObject["color"]}</p>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rating" className="text-right">
                        Rating
                      </Label>
                      <Input
                        id="rating"
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
                        value={stock}
                        onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                        className="col-span-3"
                        type="number"
                        min="0"
                      />
                    </div>
                    {errorsAsObject["stock"] && (
                      <p className="text-red-400">{errorsAsObject["stock"]}</p>
                    )}
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={handleEditProduct}
                        disabled={
                          name === product.name &&
                          price === product.price &&
                          description === product.description &&
                          images === product.images &&
                          color === product.color &&
                          rating === product.rating &&
                          stock === product.stock
                        }
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            />

            <Can
              permission="PRODUCT:REMOVE"
              permissionType="actions"
              yes={() => (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the selected
                        product and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteProduct}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            ></Can>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductDetails
