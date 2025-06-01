import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminRequired && !user.isAdmin) {
    toast({
      title: "Access Denied",
      description: "You do not have permission to access this page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;