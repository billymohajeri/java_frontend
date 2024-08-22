import { Link } from "react-router-dom"
import { Button } from "./ui/button"

const NoAccess = () => {
  return (
    <>
      <div className="bg-gray-100 text-red-600 font-semibold text-lg p-6 rounded-lg shadow-md border border-red-300">
        <p className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-red-600 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18.364 5.636l-6.364 6.364-6.364-6.364M5.636 18.364l6.364-6.364 6.364 6.364"
            />
          </svg>
          Access Denied: You don&apos;t have permission to view this page.
        </p>
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </>
  )
}

export default NoAccess
