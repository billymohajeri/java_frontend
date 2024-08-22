import { Button } from "@/components/ui/button"
import { useNavigate, useRouteError } from "react-router-dom"

const NotFound = () => {
  const error: any = useRouteError()
  const navigate = useNavigate()

  return (
    <>
      <div className="flex items-center justify-center h-screen ">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-5 max-w-lg w-full text-center">
          <h1 className="text-2xl font-bold text-gray-900">Oops!</h1>
          <p className="mt-3 text-base text-gray-500">Sorry, an unexpected error has occurred.</p>
          <img
            src="../src/assets/404.jpg"
            className="mx-auto mt-4 w-1/2 h-auto rounded"
            alt="404 Not Found"
          />
          {error && (
            <div>
              <p className="mt-3 italic text-sm text-red-500">
                {error.statusText || error.message}
              </p>
              <br />
            </div>
          )}
          <Button variant="secondary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </>
  )
}

export default NotFound
