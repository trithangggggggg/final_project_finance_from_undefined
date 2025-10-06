import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: JSX.Element;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps): JSX.Element {
  const currentAdmin = localStorage.getItem("currentAdmin");

  // Nếu chưa đăng nhập admin
  if (!currentAdmin || currentAdmin === "{}") {
    return <Navigate to="/admin/login" replace />;
  }

  // Nếu đã đăng nhập thì cho phép vào
  return children;
}
