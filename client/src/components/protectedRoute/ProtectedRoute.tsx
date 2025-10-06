import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const currentUser = localStorage.getItem("currentUser");

  // Nếu chưa đăng nhập => điều hướng về /login
  if (!currentUser || currentUser === "{}") {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập => hiển thị nội dung con
  return children;
}
