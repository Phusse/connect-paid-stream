import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !user.hasPaid) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
};

export default ProtectedRoute;
