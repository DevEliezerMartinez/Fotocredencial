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
      open: true,
      hmr: {
        overlay: false, // CAMBIO: Deshabilitar overlay que puede afectar scroll
      },
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          secure: false,
        }
      }
    },

    base: env.VITE_BASE_PATH || "/credenciales",

    build: {
      outDir: "dist/credenciales",
      assetsInlineLimit: 0,
      copyPublicDir: true,
      emptyOutDir: true,
      
      rollupOptions: {
        output: {
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
          },
          // NUEVO: Separar Ant Design en su propio chunk
          manualChunks: {
            antd: ['antd'],
            vendor: ['react', 'react-dom', 'react-router-dom']
          }
        }
      },
      
      chunkSizeWarningLimit: 1000,
      sourcemap: mode === 'development',
    },

    publicDir: "public",

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    define: {
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE || 'Sistema de Credenciales'),
      __DEV__: mode === 'development',
    },

    // ACTUALIZADO: Optimización específica para Ant Design
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'antd',
        'antd/es/button',
        'antd/es/modal',
        'antd/es/card',
        'antd/es/row',
        'antd/es/col'
      ],
    },

    // ACTUALIZADO: Configuración CSS para Ant Design
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$primary-color: ${env.VITE_PRIMARY_COLOR || '#5e35b1'};`
        },
        less: {
          javascriptEnabled: true,
          modifyVars: {
            // Variables de tema de Ant Design si las necesitas
          },
        }
      }
    }
  };
});