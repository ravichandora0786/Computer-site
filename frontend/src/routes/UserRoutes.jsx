import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Higher Order Component to protect student-only routes.
 * Redirects to home/login if not authenticated.
 */
export const UserPrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.userAuth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

/**
 * Higher Order Component to prevent logged-in users from seeing public "marketing" pages.
 * Redirects students to their dashboard.
 */
export const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.userAuth);

  if (isAuthenticated) {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};
