import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome.jsx";
import Core from "./pages/Core.jsx";
import Sucess from "./pages/Success.jsx";
import "@/assets/css/global.css";

// Obtén la ruta base del entorno o usa '/credenciales/' como valor predeterminado
const basename = import.meta.env.BASE_URL || '/credenciales/';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/core" element={<Core />} />
        <Route path="/success" element={<Sucess />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);