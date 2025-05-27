//src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Incidencias from "@/pages/admin/Incidencias";
import Planteles from "@/pages/admin/Planteles";
import DetallesPlantel from "@/pages/director/DetallesPlantel";
import DetallesCarreraPage from "@/pages/director/DetallesCarreraPage"; // Nuevo componente

export default function AdminRoutes() {
  const { isAuthenticated, role, plantel_nombre } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        {/* Rutas de admin */}
        {role === 1 && (
          <>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incidencias" element={<Incidencias />} />
            <Route path="planteles" element={<Planteles />} />
            <Route path="planteles/:slug" element={<DetallesPlantel />} />
            <Route
              path="planteles/:slug/:carrera"
              element={<DetallesCarreraPage />}
            />
          </>
        )}

        {/* Rutas para director */}
        {role === 2 && plantel_nombre && (
          <>
            <Route path="planteles/:slug" element={<DetallesPlantel />} />
            <Route
              path="planteles/:slug/:carrera"
              element={<DetallesCarreraPage />}
            />
          </>
        )}

        <Route
          index
          element={
            <Navigate
              to={
                role === 1
                  ? "/admin/dashboard"
                  : `/admin/planteles/${plantel_nombre}`
              }
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
}
