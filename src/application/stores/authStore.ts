import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import type { User } from "@/domain/entities/User";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  actions: {
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
  };
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isLoading: false,
        error: null,

        actions: {
          setUser: (user) => set({ user }),
          setToken: (token) => set({ token }),
          setLoading: (isLoading) => set({ isLoading }),
          setError: (error) => set({ error }),
          logout: () =>
            set({
              user: null,
              token: null,
              error: null,
            }),
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    )
  )
);

// 导出actions以便直接使用
export const useAuthActions = () => useAuthStore((state) => state.actions);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthToken = () => useAuthStore((state) => state.token);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
