import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginApi, logout as logoutApi, register as registerApi } from "@/services/customerApi";
import type { AuthSession, LoginInput, RegisterInput } from "@/types";

interface AuthState {
  session: AuthSession | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      login: async (input) => {
        const session = await loginApi(input);
        set({ session });
      },
      register: async (input) => {
        const session = await registerApi(input);
        set({ session });
      },
      logout: () => {
        logoutApi();
        set({ session: null });
      },
    }),
    { name: "rosado.auth" },
  ),
);
