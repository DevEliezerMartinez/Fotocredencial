// src/routes/PublicRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/public/Home";
import Core from "@/pages/public/Core";
import Success from "@/pages/public/Success";
import Login from "@/pages/public/Login";
import NotFound from "@/pages/public/NotFound";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/registro" element={<Core />} />
      <Route path="/registro-exito" element={<Success />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
