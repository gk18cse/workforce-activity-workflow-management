import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { ManagerDashboard } from '../components/dashboard/ManagerDashboard';
import { EmployeeDashboard } from '../components/dashboard/EmployeeDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  switch (user?.roleEnum) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'MANAGER':
      return <ManagerDashboard />;
    case 'EMPLOYEE':
    default:
      return <EmployeeDashboard />;
  }
};
