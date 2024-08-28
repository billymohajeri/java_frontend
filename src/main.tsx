import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./index.css"
import { RouterProvider } from "react-router-dom"
import router from "./routes/router"
import { Toaster } from "./components/ui/toaster"
import { UserProvider } from "./providers/user-provider"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
    <Toaster />
  </QueryClientProvider>
)
