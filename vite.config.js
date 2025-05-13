import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Activar mensajes de error detallados
    hmr: {
      overlay: true,
    },
  },
  // Asegurarse de que Vite sirva correctamente los archivos de la carpeta public
  publicDir: "public",
  base: "/credenciales/", // Ruta base coincidente con Nginx

  // 👇 Nueva configuración para el build
  build: {
    outDir: "dist/credenciales", // Genera todo dentro de /dist/credenciales/
    emptyOutDir: true, // Limpia el directorio antes de cada build
  },

  // Configuración de resolución de rutas
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
