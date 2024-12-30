import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Get both user and admin tokens from localStorage
  const userToken = localStorage.getItem('userToken');
  const adminToken = localStorage.getItem('adminToken');
  
  // If it's an admin route, check for adminToken, otherwise check for userToken
  if (adminOnly) {
    // Admin-only route: Require adminToken
    if (!adminToken) {
      return <Navigate to="/admin" />;  // Redirect to the admin login page if no admin token
    }
  } 

  else {
    // User route: Require userToken
    if (!userToken) {
      return <Navigate to="/" />;  // Redirect to the user login page if no user token
    }
  }

  // If the correct token exists, allow access to the protected route
  return children;
};

export default ProtectedRoute;
