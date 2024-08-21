import api from "@/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Product } from "@/types"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@radix-ui/react-navigation-menu"
import { useQuery } from "@tanstack/react-query"
import ProductDetails from "./ProductDetails"

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
    <>
      <div className="p-2 flex justify-between items-center">
        <NavigationMenu className="p-2 flex">
          <NavigationMenuList className="flex flex-row space-x-4">
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <i>Billy&apos;s Movie Shop</i>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Home</NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
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
              <p>Error: {error.message}</p>
            </div>
          )}
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
                {product.stock > 0 ? (
                  <p>{product.stock} left</p>
                ) : (
                  <p className="text-red-500">Out of stock</p>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
