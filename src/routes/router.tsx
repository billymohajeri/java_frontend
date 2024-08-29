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
import { routeNames } from "./routeNames"

const { Public, User, Order, Payment, Admin } = routeNames
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
      { path: Public.productDetails, element: <ProductDetails /> },
      {
        path: Admin.dashboard,
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
        path: User.parent,
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
        path: User.details,
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
        path: Order.parent,
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
        path: Order.details,
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
        path: Payment.parent,
        element: (
          <Can
            permission="PAYMENT:GET"
            permissionType="actions"
            yes={() => <PaymentList />}
            no={() => <NoAccess />}
          />
        )
      },
      {
        path: Payment.details,
        element: (
          <Can
            permission="PAYMENT:EDIT"
            permissionType="actions"
            yes={() => <PaymentDetails />}
            no={() => <NoAccess />}
          />
        )
      },
      {
        path: Public.productDetails,
        element: (
          <Can
            permission="PAYMENT:EDIT"
            permissionType="actions"
            yes={() => <PaymentDetails />}
            no={() => <NoAccess />}
          />
        )
      },
      {
        path: Public.productParent,
        element: (
          <Can
            permission="PRODUCT:ADD"
            permissionType="actions"
            yes={() => <ProductList />}
            no={() => <ProductListCards />}
          />
        )
      },
      { path: Public.login, element: <Login /> }
    ]
  }
])

export default router
