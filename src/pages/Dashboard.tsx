import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import api from "@/api"
import { Can } from "@/components/Can"
import NoAccess from "@/components/NoAccess"

const Dashboard = () => {
  const handleDashboardPageRender = () => {
    const { data: products, isLoading: isLoadingProducts } = useQuery({
      queryKey: ["products"],
      queryFn: async () => {
        const res = await api.get("/products")
        return res.data.data
      }
    })

    const { data: users, isLoading: isLoadingUsers } = useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        const res = await api.get("/users")
        return res.data.data
      }
    })

    const { data: orders, isLoading: isLoadingOrders } = useQuery({
      queryKey: ["orders"],
      queryFn: async () => {
        const res = await api.get("/orders")
        return res.data.data
      }
    })
    return (
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
              {/* {isLoadingOrders ? "Loading..." : `$${orders?.reduce((total, order) => total + order.totalPrice, 0).toFixed(2)}`} */}
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
                  {/* {orders?.slice(0, 5).map((order) => (
                <li key={order.id} className="border-b py-2">
                  <span>{order.customerName}</span> - <span>{`$${order.totalPrice}`}</span>
                </li>
              ))} */}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <>
      <Can
        permission="DASHBOARD:VIEW"
        permissionType="views"
        yes={() => handleDashboardPageRender()}
        no={() => <NoAccess />}
      ></Can>
    </>
  )
}

export default Dashboard
