import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">Page not found</p>
      <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Homepage
      </Link>
    </div>
  )
}

export default NotFound