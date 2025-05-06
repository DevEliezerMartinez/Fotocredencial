import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome.jsx";
import Core from "./pages/Core.jsx"; // Asegúrate de que esta ruta sea correcta
import Sucess from "./pages/Success.jsx"; // Asegúrate de que esta ruta sea correcta
import "@/assets/css/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/core" element={<Core />} />
        <Route path="/success" element={<Sucess />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
