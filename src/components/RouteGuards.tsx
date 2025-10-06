import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Protects routes for authenticated users only
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; 
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Restricts routes for unauthenticated users only
export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};
