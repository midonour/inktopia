import { Navigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useState, useEffect } from "react";
import Loader from "../Components/Loader";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return <Loader>Loading...</Loader>;
  }

  // التحقق من admin
  const isAdmin = user && user.email === "midonour2311@gmail.com";

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
