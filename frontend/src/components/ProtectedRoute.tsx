import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-muted-foreground flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-sratome text-xs uppercase tracking-wider text-muted-foreground">
            Authenticating session...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Intercept request immediately and redirect to login with original target path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.roleEnum)) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary text-muted-foreground flex items-center justify-center mb-4 border border-border text-2xl font-bold font-sratome">
          !
        </div>
        <h2 className="text-xl font-bold font-sratome uppercase tracking-wider mb-2">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md mb-6 text-xs font-sans">
          Your current role (<span className="text-foreground font-semibold">{user.roleEnum}</span>) does not have permission to view this section.
        </p>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
