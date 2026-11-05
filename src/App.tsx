import type { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { ToastContainer } from "./components/ui/Toast";

/* Public Pages */
import Signup from "./pages/SignUp";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";

/* Dashboard Pages */
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Meetings from "./pages/Meetings";
import Tasks from "./pages/Tasks";
import Finances from "./pages/Finances";
import Loans from "./pages/Loans";
import Reports from "./pages/Reports";

// Dynamic auth check evaluated whenever route elements render
const checkAuth = (): boolean => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return Boolean(token && user);
};

// Route wrapper for protected dashboard modules
function ProtectedRoute() {
  const isAuth = checkAuth();
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
}

// Route wrapper for guest-only pages (login/signup)
function GuestRoute({ children }: { children: ReactNode }) {
  const isAuth = checkAuth();
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Welcome Landing Page is publicly viewable */}
        <Route path="/" element={<Welcome />} />

        {/* Guest Auth Pages: Redirect to /dashboard if already logged in */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />

        {/* Protected Dashboard & Management Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* Unknown Routes: Redirect to Welcome */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
