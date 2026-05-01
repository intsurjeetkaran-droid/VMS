import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Unauthorized from './pages/Unauthorized';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import ReportsPage from './pages/admin/ReportsPage';
import SecurityPage from './pages/admin/SecurityPage';
import AdminVisitorsPage from './pages/admin/VisitorsPage';

// Receptionist pages
import ReceptionDashboard from './pages/receptionist/ReceptionDashboard';
import ReceptionVisitorsPage from './pages/receptionist/VisitorsPage';
import ReceptionAppointmentsPage from './pages/receptionist/AppointmentsPage';

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeVisitorsPage from './pages/employee/VisitorsPage';
import EmployeeAppointmentsPage from './pages/employee/AppointmentsPage';

// Single themed Toaster that covers ALL pages (Login, Landing, Dashboard)
const ThemedToaster = () => {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background:   theme === 'dark' ? '#27272a' : '#ffffff',
          color:        theme === 'dark' ? '#fafafa'  : '#0f172a',
          border:       theme === 'dark' ? '1px solid #3f3f46' : '1px solid #e2e8f0',
          borderRadius: '12px',
          fontSize:     '14px',
          boxShadow:    theme === 'dark'
            ? '0 4px 24px rgba(0,0,0,0.4)'
            : '0 4px 24px rgba(0,0,0,0.08)',
        },
        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
      }}
    />
  );
};
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Landing />;
  const map = {
    admin: '/admin/dashboard',
    receptionist: '/reception/dashboard',
    employee: '/employee/dashboard',
  };
  return <Navigate to={map[user.role] || '/login'} replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {/* One single Toaster for the entire app — covers Login, Landing & Dashboard */}
          <ThemedToaster />
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<RootRedirect />} />

          {/* ── Admin routes ── */}
          <Route
            element={
              <ProtectedRoute roles={['admin']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/visitors" element={<AdminVisitorsPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
            <Route path="/admin/security" element={<SecurityPage />} />
          </Route>

          {/* ── Receptionist routes ── */}
          <Route
            element={
              <ProtectedRoute roles={['receptionist', 'admin']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/reception/dashboard" element={<ReceptionDashboard />} />
            <Route path="/reception/visitors" element={<ReceptionVisitorsPage />} />
            <Route path="/reception/appointments" element={<ReceptionAppointmentsPage />} />
          </Route>

          {/* ── Employee routes ── */}
          <Route
            element={
              <ProtectedRoute roles={['employee']}>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/visitors" element={<EmployeeVisitorsPage />} />
            <Route path="/employee/appointments" element={<EmployeeAppointmentsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
