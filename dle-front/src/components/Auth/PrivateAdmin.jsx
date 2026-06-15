import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function PrivateAdmin({ children }) {
  const token = localStorage.getItem("token");

  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);

      isAuthenticated = decoded.exp * 1000 > new Date().getTime();
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated) {
    localStorage.removeItem("token");

    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
