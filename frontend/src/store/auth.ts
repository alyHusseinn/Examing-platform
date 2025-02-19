import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      logout: () => {
        localStorage.removeItem('token');
        set({ isAuthenticated: false, user: null });
      },
      setUser: (user) => set({ user, isAuthenticated: true }),
    }),
    {
      name: 'auth-storage',
    }
  )
);