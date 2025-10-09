import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, setToken, removeToken } from "../utils/auth"; // utility to handle token

export default function useAuth() {
  const [user, setUser] = useState(null); // {id, name, role, email}
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Optionally fetch user info from API
      setUser(JSON.parse(localStorage.getItem("user")));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate(`/${userData.role.toLowerCase()}/dashboard`);
  };

  const logout = () => {
    setUser(null);
    removeToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isAuthenticated = !!user;

  return { user, login, logout, isAuthenticated, loading };
}
