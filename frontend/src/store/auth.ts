import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  logout: () => set({ isAuthenticated: false, user: null }),
  setUser: (user) => set({ user, isAuthenticated: true }),
}));