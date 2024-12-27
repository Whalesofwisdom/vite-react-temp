import { Navigate } from 'react-router-dom'
import { UserService } from '../../services/userService'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const user = UserService.getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
} 