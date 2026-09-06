import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid #2a2a2a",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#D4AF37",
              secondary: "#000",
            },
          },
        }}
      />
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Landing />} />
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

        {/* Catch all */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/"} />}
        />
      </Routes>
    </>
  );
}

export default App;