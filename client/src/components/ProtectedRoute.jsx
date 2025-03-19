import { Navigate } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import LoadingSpinner from './LoadingSpinner'

function ProtectedRoute({ children }) {
  const { session, isLoading } = useSupabase()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!session) {
    return <Navigate to="/login" />
  }

  return children
}

export default ProtectedRoute