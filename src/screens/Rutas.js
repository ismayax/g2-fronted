import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/Auth"; 

function PrivateRoute({ allowedRoles }) {
  const { currentUser, userData } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userData.role)) {
    return <Navigate to="/no-access" />;
  }

  return <Outlet />;
}

export default PrivateRoute;
