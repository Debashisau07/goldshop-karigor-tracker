import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
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
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </>
  );
}

export default App;