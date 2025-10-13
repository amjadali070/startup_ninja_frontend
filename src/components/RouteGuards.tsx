import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Restricts routes for unauthenticated users only
export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if(isAuthenticated){
    return user.role == 'admin' ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Protects routes for authenticated users only
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null; 
  return isAuthenticated && user?.role !== 'admin' 
    ? children 
    : <Navigate to="/login" replace />;
};

// Restricts routes for admin users only
export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};
