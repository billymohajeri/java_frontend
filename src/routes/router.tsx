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
import PaymentDetails from "@/pages/PaymentDetails"
import NoAccess from "@/components/NoAccess"

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
      {
        path: "/dashboard",
        element: (
          <Can
            permission="DASHBOARD:VIEW"
            permissionType="views"
            yes={() => <Dashboard />}
            no={() => <NoAccess />}
          />
        )
      },
      {
        path: "/users",
        element: (
          <Can
            permission="USER:GET"
            permissionType="actions"
            yes={() => <UserList />}
            no={() => <NoAccess />}
          />
        )
      },
      {
        path: "/users/:id",
        element: (
          <Can
            permission="USER:EDIT"
            permissionType="actions"
            yes={() => <UserDetails />}
            no={() => <NoAccess />}
          />
        )
      },
      {
        path: "/orders",
        element: (
          <Can
            permission="ORDER:GET"
            permissionType="actions"
            yes={() => <OrderList />}
            no={() => <NoAccess />}
          />
        )
      },
      {
        path: "/orders/:id",
        element: (
          <Can
            permission="ORDER:EDIT"
            permissionType="actions"
            yes={() => <OrderDetails />}
            no={() => <NoAccess />}
          />
        )
      },
      {
        path: "/payments",
        element: (
          <Can
            permission="PAYMENT:GET"
            permissionType="actions"
            yes={() => <PaymentList />}
            no={() => <NoAccess />}
          />
        )
      },
      { path: "/payments/:id", element: (
        <Can
          permission="PAYMENT:EDIT"
          permissionType="actions"
          yes={() => <PaymentDetails />}
          no={() => <NoAccess />}
        />
      ) },
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
