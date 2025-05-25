import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Cargar variables de entorno basadas en el modo actual
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    
    server: {
      port: 3000,
      open: true, // Abre automáticamente el navegador
      hmr: {
        overlay: true,
      },
      // Proxy para desarrollo (opcional, si necesitas hacer requests a tu API)
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    },

    // Usar la variable de entorno para la base path
    base: env.VITE_BASE_PATH || "/credenciales",

    build: {
      outDir: "dist/credenciales",
      assetsInlineLimit: 0,  // Desactiva la conversión a base64
      copyPublicDir: true,   // Copia archivos de public/
      emptyOutDir: true,     // Limpia directorio antes del build
      
      // Optimizaciones adicionales
      rollupOptions: {
        output: {
          // Organizar archivos de salida
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'assets/images/[name]-[hash][extname]';
            }
            if (/\.css$/.test(name ?? '')) {
              return 'assets/css/[name]-[hash][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      },
      
      // Configuraciones de rendimiento
      chunkSizeWarningLimit: 1000,
      sourcemap: mode === 'development', // Solo sourcemaps en desarrollo
    },

    // Asegurar que el directorio public se copie correctamente
    publicDir: "public",

    // Configuración de resolución de rutas
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // Configuración de definición de variables globales (opcional)
    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE || 'Sistema de Credenciales'),
      __DEV__: mode === 'development',
    },

    // Optimización de dependencias
    optimizeDeps: {
      include: ['react', 'react-dom'],
    },

    // Variables CSS personalizadas (opcional)
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$primary-color: ${env.VITE_PRIMARY_COLOR || '#5e35b1'};`
        }
      }
    }
  };
});