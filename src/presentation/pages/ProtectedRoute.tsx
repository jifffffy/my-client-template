import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthUser } from '@/application/stores/authStore';

interface ProtectedRouteProps {
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectPath = '/auth' 
}) => {
  const user = useAuthUser();
  
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;