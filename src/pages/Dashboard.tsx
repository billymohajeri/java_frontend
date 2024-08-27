import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import api from "@/api"
import { Order, Payment, User } from "@/types"

const Dashboard = () => {
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

  const handleFetchUsers = async () => {
    // let token = ""
    // const user = localStorage.getItem("currentUserData")
    if (user) {
      try {
        const objUser = JSON.parse(user)
        const tokenWithQuotes = objUser?.token || null
        token = tokenWithQuotes?.replace(/"/g, "")
      } catch (error) {
        console.error("Failed to parse user data:", error)
      }
    }
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

  return (
    <>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {isLoadingProducts ? "Loading..." : products?.length}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{isLoadingUsers ? "Loading..." : users?.length}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {isLoadingOrders ? "Loading..." : orders?.length}
            </h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {isLoadingPayments
                ? "Loading..."
                : `$${payments?.reduce((total, payment) => total + payment.amount, 0).toFixed(2)}`}
            </h2>
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
