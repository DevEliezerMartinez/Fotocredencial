import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoutes from "@/routes/PublicRoutes";
import AdminRoutes from "@/routes/AdminRoutes";
import Home from "@/pages/public/Home";
import NotFound from "@/pages/public/NotFound";

export default function AppRouter() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {/* Ruta raíz - muestra Home directamente */}
        <Route index element={<Home />} />

        {/* Rutas públicas */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* Rutas administrativas - toda la lógica ahora está dentro de AdminRoutes */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Catch-all para rutas no definidas */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}