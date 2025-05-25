import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth.store";
import PublicRoutes from "./PublicRoutes";
import { Suspense } from "react";

export default function AppRouter() {
  const { isAuthenticated } = useAuthStore();

  console.log("Router auth state:", { isAuthenticated });

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        <>
          {/* Rutas públicas cuando NO está autenticado */}
          <Route path="/*" element={<PublicRoutes />} />
        </>
      </Routes>
    </Suspense>
  );
}
