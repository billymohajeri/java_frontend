import { createBrowserRouter } from "react-router-dom"

import NotFound from "@/pages/NotFound.js"
import ProductList from "@/pages/ProductList.js"
import Navbar from "@/components/Navbar"
import ProductDetails from "@/pages/ProductDetails"
import Dashboard from "@/pages/Dashboard"
import Login from "@/pages/Login"
import Users from "@/pages/UserList"
import UserDetails from "@/pages/UserDetails"
import { Can } from "@/components/Can"

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
            no={() => <ProductList />}
          />
        )
      },
      { path: "/products/:id", element: <ProductDetails /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/users", element: <Users /> },
      { path: "/users/:id", element: <UserDetails /> },
      { path: "/login", element: <Login /> }
    ]
  }
])

export default router
