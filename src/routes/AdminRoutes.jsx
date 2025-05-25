// src/routes/AdminRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '../pages/admin';
import { RoleGuard } from '../components/admin';
import { lazy } from 'react';

// Lazy loading para rutas administrativas
const AdminPanel = lazy(() => import('../pages/admin/admin/AdminPanel'));
const DirectorPanel = lazy(() => import('../pages/admin/director/DirectorPanel'));

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />}>
        {/* Rutas compartidas */}
        <Route index element={<div>Bienvenido al Dashboard</div>} />

        {/* Rutas solo para admin */}
        <Route
          path="admin/*"
          element={
            <RoleGuard allowedRoles={[1]}>
              <AdminPanel />
            </RoleGuard>
          }
        />

        {/* Rutas solo para director */}
        <Route
          path="director/*"
          element={
            <RoleGuard allowedRoles={[2]}>
              <DirectorPanel />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
}