import api from "@/api"
import { z } from "zod"
import { Can } from "@/components/Can"
import { Button } from "@/components/ui/button"
import { Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
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
import { useContext, useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UserContext } from "@/providers/user-provider"

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

  const handleEditProduct = async (editedProduct: Product) => {
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
    const res = await api.put(`/products`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    toast({
      title: "✅ Edited!",
      className: "bg-neutral-300 text-black dark:bg-neutral-600 dark:text-white",
      description: `Product "${res.data.data.name}" edited successfully.`
    })
    navigate("/products")
    return res.data.data
  }

  const newProductSchema = z.string()

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price)
      setDescription(product.description)
      setImages(product.images)
      setColor(product.color)
      setRating(product.rating)
      setStock(product.stock)
    }
  }, [product])

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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Edit</Button>
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
                          Name
                        </Label>
                        <Input
                          id="Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">
                          Price
                        </Label>
                        <Input
                          id="price"
                          value={price}
                          onChange={(e) => setPrice(parseFloat(e.target.value))}
                          className="col-span-3"
                          type="number"
                          min="0"
                        />
                      </div>
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
                        onChange={(e) => setImages(e.target.value.split(","))}
                        className="col-span-3"
                        type="url"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="color" className="text-right">
                        Color
                      </Label>
                      <Input
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="col-span-3"
                      />
                    </div>

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

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="stock" className="text-right">
                        Stock
                      </Label>
                      <Input
                        id="stock"
                        value={stock}
                        onChange={(e) => setStock(parseInt(e.target.value))}
                        className="col-span-3"
                        type="number"
                        min="0"
                      />
                    </div>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button
                        onClick={() => {
                          if (id) {
                            handleEditProduct({
                              id,
                              name,
                              price,
                              description,
                              images,
                              meta,
                              color,
                              rating,
                              stock
                            })
                          }
                        }}
                      >
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            ></Can>
            <Can
              permission="PRODUCT:REMOVE"
              permissionType="actions"
              yes={() => (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
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
