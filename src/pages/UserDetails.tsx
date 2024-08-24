import api from "@/api"
import { Can } from "@/components/Can"
import Loading from "@/components/Loading"
import { Button } from "@/components/ui/button"
import { User } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"

const UserDetails = () => {
  const { id } = useParams<{ id: string }>()

  const handleFetchUser = async () => {
    const tokenWithQuotes = localStorage.getItem("userToken")
    const token = tokenWithQuotes?.replace(/"/g, "")
    const res = await api.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.status !== 200) {
      throw new Error("Something went wrong!")
    }
    console.log(res)
    return res.data.data
  }

  const {
    data: user,
    isLoading,
    isError,
    error
  } = useQuery<User>({
    queryKey: ["user", id],
    queryFn: handleFetchUser
  })

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold">
          Error: {error?.message || "Unable to fetch product details"}
        </p>
      </div>
    )
  }

  return (
    <>
      {isLoading && <Loading item="user" />}

      {user && (
        <div className="container mx-auto mt-5">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 text-center mb-5">
            User details
          </h2>

          <div className="bg-white shadow-md rounded-lg p-5">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/3 mt-4 md:mt-0 md:ml-4">
                <div className="p-4">
                  <h5 className="text-2xl font-semibold mb-2 text-gray-900">
                    {user.firstName} {user.lastName}
                  </h5>
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Phone Number:</strong> {user.phoneNumber}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Address:</strong> {user.address}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Birth Date:</strong> {user.birthDate}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Role:</strong> {user.role}
                  </p>
                  <p className="text-gray-500 text-sm">
                    <small>User ID: {user.id}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Can
              permission="USER:EDIT"
              permissionType="actions"
              yes={() => (
                <Button asChild>
                  <Link to={`/users/${user.id}/edit`}>Edit</Link>
                </Button>
              )}
            ></Can>
            <Can
              permission="USER:REMOVE"
              permissionType="actions"
              yes={() => (
                <Button asChild>
                  <Link to={`/users/${user.id}/delete`}>Delete</Link>
                </Button>
              )}
            ></Can>
          </div>
        </div>
      )}
    </>
  )
}

export default UserDetails
