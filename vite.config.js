import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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
  publicDir: 'public',
  // Configuración de resolución de rutas
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})