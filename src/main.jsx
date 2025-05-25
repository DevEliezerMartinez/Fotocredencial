// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Opcional para desarrollo
import { ConfigProvider, App } from "antd";
import '@ant-design/v5-patch-for-react-19';

// Estilos
import "@/assets/css/global.css";

// Componentes
import AppRouter from "@/routes/index";

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita recargas al cambiar de pestaña
      retry: 1, // Solo 1 reintento por fallo
      staleTime: 1000 * 60 * 5, // 5 minutos de caché
    },
    mutations: {
      retry: 1,
    },
  },
});

window.addEventListener("error", (event) => {
  console.error("Error capturado:", event.error);
});

console.log("Environment variables:", {
  basename: import.meta.env.VITE_BASE_PATH,
  apiUrl: import.meta.env.VITE_API_BASE_URL,
  isDev: import.meta.env.DEV,
});

// Obtener configuración desde .env
const basename = import.meta.env.VITE_BASE_PATH || "/credenciales";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <BrowserRouter basename={basename}>
          <App>
            <AppRouter />
          </App>
        </BrowserRouter>
      </ConfigProvider>
      {import.meta.env.DEV && ( // Devtools solo en desarrollo
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);
