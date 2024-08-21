import { useNavigate, useRouteError } from 'react-router-dom'

const NotFound = () => {
  const error: any = useRouteError()

  const navigate = useNavigate()

  return (
    <div className="container mt-5">
      <div className="card text-center">
        <div className="card-body">
          <h1 className="card-title">Oops!</h1>
          <p className="card-text">Sorry, an unexpected error has occurred.</p>
          <img
            src="../src/assets/404.jpg"
            className="img-fluid mb-4 not-found-image"
            alt="404 Not Found"
          />
          {error && (
            <p className="card-text">
              <i>{error.statusText || error.message}</i>
            </p>
          )}
          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
