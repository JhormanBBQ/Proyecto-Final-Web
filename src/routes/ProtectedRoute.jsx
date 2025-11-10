import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) return <p>Cargando...</p>
  if (!user) return <Navigate to="/login" />

  return children
}
