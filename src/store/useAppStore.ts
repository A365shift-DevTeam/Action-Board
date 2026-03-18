import { create } from 'zustand';

interface AppState {
  isAuthenticated: boolean;
  theme: 'dark' | 'light';
  login: () => void;
  logout: () => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  theme: 'dark', // Default to dark as requested
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
