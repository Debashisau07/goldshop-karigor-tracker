import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import AdminPanel from "./pages/AdminPanel";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/forgot-password"
          element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/reset-password"
          element={!user ? <ResetPassword /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={
            user ? (
              user.role === "admin" ? (
                <AdminPanel />
              ) : (
                <Navigate to="/dashboard" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Default */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </>
  );
}

export default App;