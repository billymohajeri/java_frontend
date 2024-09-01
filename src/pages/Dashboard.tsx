import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import api from "@/api"
import { Order, Payment, User } from "@/types"
import { useContext } from "react"
import { UserContext } from "@/providers/user-provider"
import { User2Icon, UserCheck, UserPlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate()
  const context = useContext(UserContext)
  const token = context?.token

  const handleFetchUsers = async () => {
    const res = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    return res.data.data
  }

  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/products")
      return res.data.data
    }
  })

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: handleFetchUsers
  })

  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return res.data.data
    }
  })

  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await api.get("/payments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return res.data.data
    }
  })

  const adminCount = users?.filter((user) => user.role === "ADMIN").length || 0
  const userCount = users?.filter((user) => user.role === "USER").length || 0

  return (
    <>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="text-2xl font-bold">
              {isLoadingProducts ? "Loading..." : products?.length}
            </h4>
          </CardContent>
        </Card>
        <Card className="flex flex-col  h-full">
          <div className="flex  items-start">
            <CardHeader className="flex-1">
              <CardTitle>
                <div>
                  Total Users:
                  <h2 className="text-2xl font-bold">
                    {isLoadingUsers ? "Loading..." : users?.length}
                  </h2>
                </div>
              </CardTitle>
            </CardHeader>
            <div className="flex flex-col p-5 ">
              <div className="text-lg flex">
                <UserCheck className="ml-1" />
                <p className="ml-4">Admins: {adminCount}</p>
              </div>
              <div className="text-lg flex">
                <User2Icon />
                <p className="ml-5">Users: {userCount}</p>
              </div>
            </div>
          </div>
          <CardFooter className="flex justify-start mt-auto">
            <Button onClick={() => navigate("/register")}>
              <UserPlusIcon className="mr-4" />
              Add New User
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="text-2xl font-bold">
              {isLoadingOrders ? "Loading..." : orders?.length}
            </h4>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <h4 className="text-2xl font-bold">
              {isLoadingPayments
                ? "Loading..."
                : `$${payments?.reduce((total, payment) => total + payment.amount, 0).toFixed(2)}`}
            </h4>
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <p>Loading...</p>
              ) : (
                <ul>
                  {orders?.slice(0, 5).map((order) => (
                    <li key={order.id} className="border-b py-2">
                      <span>{order.userId}</span> - <span>{`$${order.status}`}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Dashboard
