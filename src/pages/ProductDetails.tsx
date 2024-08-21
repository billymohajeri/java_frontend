const ProductDetails = () => {
  return (
    <div className="container mx-auto mt-5">
      <div className="bg-white shadow-md rounded-lg p-5">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            {/* <img src={product.images[0]} className="w-full h-auto object-cover rounded-lg" alt={product.title} /> */}
          </div>
          <div className="md:w-2/3 mt-4 md:mt-0 md:ml-4">
            <div className="p-4">
              <p>{/* <h5 className="text-xl font-semibold mb-2">{product.title}</h5> */}</p>
              <p className="text-gray-700 mb-2">
                {/* <strong>Category:</strong> {product.category} */}
              </p>
              <p className="text-gray-700 mb-2">
                {/* <strong>Description:</strong> {product.description} */}
              </p>
              <p className="text-gray-700 mb-2">{/* <strong>Price:</strong> ${product.price} */}</p>
              <p className="text-gray-700 mb-2">
                {/* <strong>Rating:</strong> {product.rating} ({product.reviews.length} reviews) */}
              </p>
              <p className="text-gray-500 text-sm">
                {/* <small>Product ID: {product.id}</small> */}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <button
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"
          //   onClick={() => navigate('/')}
        >
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default ProductDetails
