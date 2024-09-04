import { createBrowserRouter } from "react-router-dom"

import NotFound from "@/pages/NotFound.js"
import ProductListCards from "@/pages/ProductListCards.js"
import Navbar from "@/components/Navbar"
import ProductDetails from "@/pages/ProductDetails"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import UserDetails from "@/pages/UserDetails"
import ProductList from "@/pages/ProductList"
import UserList from "@/pages/UserList"
import OrderList from "@/pages/OrderList"
import OrderDetails from "@/pages/OrderDetails"
import PaymentList from "@/pages/PaymentList"
import PaymentDetails from "@/pages/PaymentDetails"
import { routeNames } from "./routeNames"

const { Public, User, Order, Payment, Admin } = routeNames
const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    element: <Navbar />,
    children: [
      { path: "/", element: <ProductListCards /> },
      { path: Public.productDetails, element: <ProductDetails /> },
      // { path: Public.checkout, element: <Checkout /> },
      { path: Admin.dashboard, element: <Dashboard /> },
      { path: User.parent, element: <UserList /> },
      { path: User.details, element: <UserDetails /> },
      { path: Order.parent, element: <OrderList /> },
      { path: Order.details, element: <OrderDetails /> },
      { path: Payment.parent, element: <PaymentList /> },
      { path: Payment.details, element: <PaymentDetails /> },
      { path: Public.productParent, element: <ProductList /> },
      { path: Public.login, element: <Login /> }
    ]
  }
])

export default router
