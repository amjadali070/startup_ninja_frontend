import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useBusinessProfile } from '../hooks/useBusinessProfile';

// Restricts routes for unauthenticated users only
export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if(isAuthenticated){
    if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    const isTeamSalesUser = !!user?.addedBy && (user?.teamRole === 'Member' || user?.teamRole === 'Manager');
    return isTeamSalesUser ? <Navigate to="/ai-tools/sales" replace /> : <Navigate to="/dashboard" replace />;
  }
  return children;
};

// Protects routes for authenticated users only
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  const { needsOnboarding } = useBusinessProfile();
  if (loading) return null;
  if (!isAuthenticated || user?.role === 'admin') {
    return <Navigate to="/login" replace />;
  }

  const isTeamSalesUser = !!user?.addedBy && (user?.teamRole === 'Member' || user?.teamRole === 'Manager');
  if (isTeamSalesUser && !location.pathname.startsWith('/ai-tools/sales')) {
    return <Navigate to="/ai-tools/sales" replace />;
  }

  if (needsOnboarding && !isTeamSalesUser && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
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
