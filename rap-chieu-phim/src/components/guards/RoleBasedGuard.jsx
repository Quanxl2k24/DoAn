import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminGuard = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Chặn nếu không phải ADMIN
  if (user.role?.name !== 'ADMIN' && user.roleId !== 1) { // Assuming 1 is ADMIN or we check role.name
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export const HomeGuard = () => {
  const { user } = useAuth();
  const location = useLocation();

  if ((user?.role?.name === 'ADMIN') && location.pathname === '/') {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
