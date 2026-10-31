import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./pages/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import VendorSignup from "./pages/VendorSignup";
import VendorDashboard from "./pages/VendorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VendorsManagement from "./pages/VendorsManagement";
import BookingsManagement from "./pages/BookingsManagement";
import Vendors from "./pages/Vendors";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/:type" element={<Login />} />
        <Route path="/register" element={<VendorSignup />} />

        {/* Protected Admin Route */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedType="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Vendor Route */}
        <Route 
          path="/vendor-dashboard" 
          element={
            <ProtectedRoute allowedType="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          } 
        />

         <Route 
            path="/admin/vendors" 
            element={
              <ProtectedRoute allowedType="admin">
                <VendorsManagement />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute allowedType="admin">
                <BookingsManagement />
              </ProtectedRoute>
            } 
          />

        {/* Fallback - Redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
