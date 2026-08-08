import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);