import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FullPageSpinner } from '../ui/Spinner';

/**
 * ProtectedRoute — wraps layout routes
 * - Redirects to /login if not authenticated
 * - Redirects to /unauthorized if role not allowed
 * - Renders children (AppLayout with Outlet) if authorized
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  // children is <AppLayout /> which contains <Outlet /> — renders nested routes
  return children;
};

export default ProtectedRoute;
