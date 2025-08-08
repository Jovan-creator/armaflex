import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredPermission?: string;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  requiredPermission,
  fallbackPath = '/login' 
}: ProtectedRouteProps) {
  const { isLoggedIn, hasPermission } = useUser();

  // Check if authentication is required
  if (requireAuth && !isLoggedIn) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check for specific permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
