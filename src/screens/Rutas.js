import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ role }) => {
  const { user } = useAuth();
  const userRole = localStorage.getItem('userRole');

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
