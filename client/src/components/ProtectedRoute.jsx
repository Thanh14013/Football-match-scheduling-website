import { Navigate, Outlet } from 'react-router-dom'
import { useSupabase } from '../contexts/SupabaseContext'
import LoadingScreen from './LoadingScreen'

function ProtectedRoute() {
  const { user, loading, initialized } = useSupabase()
  
  if (loading || !initialized) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute