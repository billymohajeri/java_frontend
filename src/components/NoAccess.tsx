import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const NoAccess = () => {
  return (
    <div className="p-9">
      <Alert className="bg-gray-100 text-lg p-6 text-red-600 font-semibold text-lg p-6 rounded-lg shadow-md border border-red-300">
        <ExclamationTriangleIcon color="#dc2626" className="h-6 w-6 animate-bounce" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription className="">
          You don&apos;t have permission to view this page.
        </AlertDescription>
      </Alert>
      <div className="flex justify-center gap-4 mt-4">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}

export default NoAccess
