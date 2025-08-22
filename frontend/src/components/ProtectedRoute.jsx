import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";
import "./css/ProtectedRoute.css";

const ProtectedRoute = ({ roles = [], children }) => {
  const { authState } = useAuth();
  const { isLoading, isAuthenticated, user } = authState;

  if (isLoading) {
    return <Loader label="Checking permissions..." />;
  }

  if (!isAuthenticated) {
    // not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }
  if(roles === "*"){
    return <>{children}</>;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // logged in but role not allowed, show access denied
    return (
      <div className="access-denied-container">
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <Link to="/" className="home-link">
          Go to Home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
