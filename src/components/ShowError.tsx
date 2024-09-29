import { Button } from "./ui/button"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const ShowError = ({
  resourceName,
  errorMessage
}: {
  resourceName: string
  errorMessage: string
}) => {
  return (
    <div className="p-9">
      <Alert className="bg-gray-100 text-lg p-6 text-red-600 font-semibold text-lg p-6 rounded-lg shadow-md border border-red-300">
        <ExclamationTriangleIcon color="#dc2626" className="h-6 w-6 animate-bounce mt-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="">Unable to fetch {resourceName}</AlertDescription>
      </Alert>
      <div className="flex justify-center gap-4 mt-4">
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    </div>
  )
}

export default ShowError
