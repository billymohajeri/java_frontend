import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"

import api from "@/api"
import NoAccess from "@/components/NoAccess"
import { Order, Payment, User } from "@/types"
import { UserContext } from "@/providers/user-provider"
import { SmallLoading } from "@/components/Loading"

import { useQuery } from "@tanstack/react-query"
import { EuroIcon, ShoppingBag, ShoppingCart, User2Icon, UserCheck, Users2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const Dashboard = () => {
  const navigate = useNavigate()
  const context = useContext(UserContext)
  const token = context?.token
  const role = context?.user?.role

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
    },
    enabled: role === "ADMIN"
  })

  const { data: users, isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: handleFetchUsers,
    enabled: role === "ADMIN"
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
    },
    enabled: role === "ADMIN"
  })

  orders?.sort((a, b) => b.address.length - a.address.length)

  const { data: payments, isLoading: isLoadingPayments } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await api.get("/payments", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return res.data.data
    },
    enabled: role === "ADMIN"
  })

  const adminCount = users?.filter((user) => user.role === "ADMIN").length || 0
  const userCount = users?.filter((user) => user.role === "USER").length || 0

  return (
    <>
      {(!token || role === "USER") && <NoAccess />}

      {users?.length && (
        <>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24">
            <Card>
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="text-2xl font-bold">
                  {isLoadingProducts ? "Loading..." : products?.length}
                </h4>
              </CardContent>
              <CardFooter className="flex justify-start mt-auto">
                <Button onClick={() => navigate("/products")}>
                  <ShoppingBag className="mr-4" />
                  See All
                </Button>
              </CardFooter>
            </Card>
            <Card className="flex flex-col h-full">
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
                <Button onClick={() => navigate("/users")}>
                  <Users2Icon className="mr-4" />
                  See All
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <SmallLoading />
                ) : orders ? (
                  <h4 className="text-2xl font-bold">${orders.length}</h4>
                ) : (
                  <p>No orders to show</p>
                )}
              </CardContent>

              {orders && (
                <CardFooter className="flex justify-start mt-auto">
                  <Button onClick={() => navigate("/orders")}>
                    <ShoppingCart className="mr-4" />
                    See All
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPayments ? (
                  <SmallLoading />
                ) : payments ? (
                  <h4 className="text-2xl font-bold">
                    ${payments.reduce((total, payment) => total + payment.amount, 0).toFixed(2)}
                  </h4>
                ) : (
                  <p>No sales to show</p>
                )}
              </CardContent>
              {payments && (
                <CardFooter className="flex justify-start mt-auto">
                  <Button onClick={() => navigate("/payments")}>
                    <EuroIcon className="mr-4" />
                    See All
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
          <div className="grid grid-cols-3 gap-6 p-6">
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingOrders ? (
                    <SmallLoading />
                  ) : orders ? (
                    <ul>
                      {orders.slice(0, 7).map((order) => (
                        <li key={order.id} className="border-b py-2">
                          <Link to={`/orders/${order.id}`}>
                            <span>{order.address}</span> - <span>{`${order.comments}`}</span> -{" "}
                            <span>{`${order.status}`}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No orders to show</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingPayments ? (
                    <SmallLoading />
                  ) : payments ? (
                    <ul>
                      {payments.slice(0, 7).map((payment) => (
                        <li key={payment.id} className="border-b py-2">
                          <Link to={`/payments/${payment.id}`}>
                            <span>€ {payment.amount}</span> - <span>{`$${payment.status}`}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No payments to show</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Dashboard
