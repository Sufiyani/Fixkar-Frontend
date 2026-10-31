import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedType }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    // If logged in but wrong type, clear storage and redirect
    if (token && userType && userType !== allowedType) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userType');
      localStorage.removeItem('adminName');
      localStorage.removeItem('vendorId');
      localStorage.removeItem('vendorName');
      localStorage.removeItem('vendorEmail');
      
      // Trigger navbar update
      window.dispatchEvent(new Event('authChange'));
    }
  }, [token, userType, allowedType]);

  // If no token, redirect to home (not login page)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If user type doesn't match, redirect to home
  if (userType !== allowedType) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and correct type, render children
  return children;
};

export default ProtectedRoute;