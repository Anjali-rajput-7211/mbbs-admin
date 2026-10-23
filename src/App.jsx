import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Header";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashborad from "./dashborad/AdminDashborad";
import SuperAdminDashboard from "./dashborad/SuperAdminDashboard";
import ErrorBoundary from "./ErrorBoundary";

// Protected Route for Super Admin
const ProtectedSuperAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (admin.role !== "superAdmin") {
    // If regular admin tries to access Super Admin, redirect to Admin dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Protected Route for Admin (Super Admin can also access)
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (admin.role !== "admin" && admin.role !== "superAdmin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Smart Root Redirect based on Role
const RootRedirect = () => {
  const token = localStorage.getItem("token");
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (admin.role === "superAdmin") {
    return <Navigate to="/superadmin" replace />;
  }

  if (admin.role === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Header />
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />

          {/* Super Admin Command Center Route */}
          <Route
            path="/superadmin"
            element={
              <ProtectedSuperAdminRoute>
                <SuperAdminDashboard />
              </ProtectedSuperAdminRoute>
            }
          />

          {/* Admin Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashborad />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashborad />
              </ProtectedAdminRoute>
            }
          />

          {/* Password Recovery Routes */}
          <Route path="/forgetPassword" element={<ForgetPassword />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
