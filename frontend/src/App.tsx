import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { IssuesPage } from './pages/IssuesPage';
import { AuditLogPage } from './pages/AuditLogPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                }
              />
              <Route
                path="/tasks"
                element={
                  <MainLayout>
                    <TasksPage />
                  </MainLayout>
                }
              />
              <Route
                path="/workflows"
                element={
                  <MainLayout>
                    <WorkflowsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/issues"
                element={
                  <MainLayout>
                    <IssuesPage />
                  </MainLayout>
                }
              />
              <Route
                path="/audit-log"
                element={
                  <MainLayout>
                    <AuditLogPage />
                  </MainLayout>
                }
              />
            </Route>

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
