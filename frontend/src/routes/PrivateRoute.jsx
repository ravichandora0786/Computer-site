import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutApp } from '../pages/admin/common/slice';
import { toast } from 'react-toastify';
import { selectAccessToken } from '../pages/admin/common/selector'

// Helper to check if JWT is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    const exp = decoded.exp;
    const now = Date.now() / 1000;
    return exp < now;
  } catch (error) {
    return true; // invalid format
  }
};

const PrivateRoute = ({ children }) => {
  const accessToken = useSelector(selectAccessToken);
  const location = useLocation();
  const dispatch = useDispatch();

  if (!accessToken || isTokenExpired(accessToken)) {
    // Dispatch logout to clear state if token is expired
    if (accessToken) {
      dispatch(logoutApp());
      toast.error('Session expired. Please login again.');
    }
    
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
