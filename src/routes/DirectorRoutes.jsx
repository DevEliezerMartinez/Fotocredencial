// src/routes/DirectorRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import DirectorDashboard from "@/pages/director/Dashboard";
import Reportes from "@/pages/director/Reportes";

export default function DirectorRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DirectorDashboard />} />
        <Route path="reportes" element={<Reportes />} />
      </Routes>
    </AdminLayout>
  );
}