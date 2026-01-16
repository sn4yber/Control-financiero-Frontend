import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
