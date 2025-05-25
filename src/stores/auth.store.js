// src/stores/auth.store.js
import { create } from 'zustand';
import axios from '../lib/axios';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  role: null,
  plantel_id: null,
  isLoading: false, // Nuevo estado para carga global

  login: async (credentials) => {
    try {
      set({ isLoading: true });
      const response = await axios.post('/admin/auth/login', credentials);
      
      set({
        user: response.data.user,
        isAuthenticated: true,
        role: response.data.user.rol_id,
        plantel_id: response.data.user.plantel_id,
        isLoading: false
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
      await axios.post('/admin/auth/logout');
      set({ 
        user: null,
        isAuthenticated: false,
        role: null,
        plantel_id: null,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Error al cerrar sesión:', error);
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get('/auth/me');
      set({
        user: response.data.user,
        isAuthenticated: true,
        role: response.data.user.rol_id,
        plantel_id: response.data.user.plantel_id,
        isLoading: false
      });
      return true;
    } catch {
      set({ 
        user: null,
        isAuthenticated: false,
        role: null,
        plantel_id: null,
        isLoading: false
      });
      return false;
    }
  }
}));