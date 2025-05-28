// src/stores/auth.store.js
import { create } from "zustand";
import axios from "../lib/axios";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  role: null,
  plantel_id: null,
  isLoading: false, // Nuevo estado para carga global
  plantel_nombre: null, // Añade esto

  login: async (credentials) => {
    try {
      set({ isLoading: true });
      const response = await axios.post("auth/login", credentials);
      console.log(response.data.user.id);

      set({
        user: response.data.user.id,
        isAuthenticated: true,
        role: response.data.user.rol_id,
        plantel_id: response.data.user.plantel_id,
        plantel_nombre: response.data.user.plantel_nombre, // Añade esto
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await axios.post("/auth/logout"); // Asegúrate que coincide con tu ruta backend

      // Limpiar todo el estado
      set({
        user: null,
        isAuthenticated: false,
        role: null,
        plantel_id: null,
        plantel_nombre: null,
        isLoading: false,
      });

      // Redirigir se manejará en el componente
      return true;
    } catch (error) {
      set({ isLoading: false });
      console.error("Error al cerrar sesión:", error);
      return false;
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get("/auth/me");
      set({
        user: response.data.user,
        isAuthenticated: true,
        role: response.data.user.rol_id,
        plantel_id: response.data.user.plantel_id,
        isLoading: false,
      });
      return true;
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        role: null,
        plantel_id: null,
        isLoading: false,
      });
      return false;
    }
  },
}));
