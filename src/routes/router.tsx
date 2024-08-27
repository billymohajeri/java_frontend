import { createBrowserRouter } from "react-router-dom"

import NotFound from "@/pages/NotFound.js"
import ProductListCards from "@/pages/ProductListCards.js"
import Navbar from "@/components/Navbar"
import ProductDetails from "@/pages/ProductDetails"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import UserDetails from "@/pages/UserDetails"
import { Can } from "@/components/Can"
import ProductList from "@/pages/ProductList"
import UserList from "@/pages/UserList"
import OrderList from "@/pages/OrderList"
import OrderDetails from "@/pages/OrderDetails"
import PaymentList from "@/pages/PaymentList"

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    element: <Navbar />,
    children: [
      {
        path: "/",
        element: (
          <Can
            permission="DASHBOARD:VIEW"
            permissionType="views"
            yes={() => <Dashboard />}
            no={() => <ProductListCards />}
          />
        )
      },
      { path: "/products/:id", element: <ProductDetails /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/users", element: <UserList /> },
      { path: "/users/:id", element: <UserDetails /> },
      { path: "/orders", element: <OrderList /> },
      { path: "/orders/:id", element: <OrderDetails /> },
      { path: "/payments", element: <PaymentList /> },
      // { path: "/payments/:id", element: <OrderDetails /> },
      {
        path: "/products",
        element: (
          <Can
            permission="PRODUCT:ADD"
            permissionType="actions"
            yes={() => <ProductList />}
            no={() => <ProductListCards />}
          />
        )
      },
      { path: "/login", element: <Login /> }
    ]
  }
])

export default router
