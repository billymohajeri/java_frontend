const Loading = ({ item = "" }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
      <p className="ml-4 text-red-500 font-semibold">Loading {item}...</p>
    </div>
  )
}

export default Loading
