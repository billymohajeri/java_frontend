import { createBrowserRouter } from "react-router-dom"

import NotFound from "@/pages/NotFound.js"
import ProductList from "@/pages/ProductList.js"
import Navbar from "@/components/ui/Navbar"
import ProductDetails from "@/pages/ProductDetails"
import Dashboard from "@/pages/Dashboard"

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <NotFound />,
    element: <Navbar />,
    children: [
      { path: "/", element: <ProductList /> },
      { path: "/products/:id", element: <ProductDetails /> },
      { path: "/dashboard", element: <Dashboard /> }
    ]
  }
])

export default router
