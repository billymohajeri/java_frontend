const Loading = ({ item = "" }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
      <p className="ml-4 text-red-500 font-semibold">Loading {item}...</p>
    </div>
  )
}

const SmallLoading = () => {
  return (
    <div className="my-4 flex justify-center items-center">
      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-gray-500"></div>
      <p className="ml-4 text-gray-500 text-base">Loading...</p>
    </div>
  )
}

export { Loading , SmallLoading}
