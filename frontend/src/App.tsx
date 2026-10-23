import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeProvider';
import { ToastProvider } from './components/ui/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { WorkforcePage } from './pages/WorkforcePage';
import { ActivityPage } from './pages/ActivityPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { IssuesPage } from './pages/IssuesPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { UsersPage } from './pages/UsersPage';

// Default entry point component: redirects authenticated users to /dashboard and unauthenticated users to /login
function RootEntry() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-muted-foreground flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            Initializing WorkFlow Pro...
          </span>
        </div>
      </div>
    );
  }
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Default Entry Point: Login is default for guests, dashboard for active sessions */}
              <Route path="/" element={<RootEntry />} />

              {/* Public Login Route (automatically redirects to dashboard if already authenticated) */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Application Routes Wrapped within ProtectedRoute */}
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
                  path="/workforce"
                  element={
                    <MainLayout>
                      <WorkforcePage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <MainLayout>
                      <UsersPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/departments"
                  element={
                    <MainLayout>
                      <DepartmentsPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/approvals"
                  element={
                    <MainLayout>
                      <TasksPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/activity"
                  element={
                    <MainLayout>
                      <ActivityPage />
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
                  path="/projects"
                  element={
                    <MainLayout>
                      <ProjectsPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <MainLayout>
                      <CalendarPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <MainLayout>
                      <AnalyticsPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <MainLayout>
                      <NotificationsPage />
                    </MainLayout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <MainLayout>
                      <SettingsPage />
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

              {/* Default Fallback Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
