import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function PrivateRoute({ children }) {
  const user = useSelector((state) => state.auth.user);
  if (!user) {
    return <Navigate to="/login" replace></Navigate>;
  }
  return children;
}
