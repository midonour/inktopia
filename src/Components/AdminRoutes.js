import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useState, useEffect } from "react";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ننتظر شوية لغاية ما user يتحمل من context
    if (isAuthenticated !== null) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    // ممكن تحط سبينر أو رسالة انتظار
    return <p>Loading...</p>;
  }

  // التحقق من admin
  const isAdmin = user && user.email === "midonour2311@gmail.com";

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
