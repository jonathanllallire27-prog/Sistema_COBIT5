import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Audits from '@/pages/Audits';
import AuditDetail from '@/pages/AuditDetail';
import Execution from '@/pages/Execution';
import Findings from '@/pages/Findings';
import FindingNew from '@/pages/FindingNew';
import FindingEdit from '@/pages/FindingEdit';
import Reports from '@/pages/Reports';
import CobitProcesses from '@/pages/CobitProcesses';
import Users from '@/pages/Users';
import Settings from '@/pages/Settings';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas protegidas */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="audits" element={<Audits />} />
        <Route path="audits/:id" element={<AuditDetail />} />
        <Route path="execution" element={<Execution />} />
        <Route path="execution/:id" element={<Execution />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/audit/:auditId" element={<Reports />} />
        <Route path="audits/:id/findings" element={<Findings />} />
        <Route path="audits/:id/findings/new" element={<FindingNew />} />
        <Route path="audits/:id/findings/:findingId/edit" element={<FindingEdit />} />
        <Route path="cobit" element={<CobitProcesses />} />
        <Route 
          path="users" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route path="settings" element={<Settings />} />
      </Route>
      
      {/* Ruta 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;