import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  "./assets/css/global.css"
import '@ant-design/v5-patch-for-react-19';


import Home from "./pages/student/Home.jsx";

const basename = import.meta.env.BASE_URL || "/credenciales/";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
