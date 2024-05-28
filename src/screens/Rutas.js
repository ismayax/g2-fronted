import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const userRole = user?.customClaims?.role;

  if (role && userRole !== role) {
    return <Navigate to="/unauthorized" />; // Ruta para manejar accesos no autorizados
  }

  return children;
}

export default PrivateRoute;
