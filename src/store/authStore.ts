import { create } from "zustand";
import { persist } from "zustand/middleware";
import { login as loginApi, logout as logoutApi, me as meApi, register as registerApi } from "@/services/customerApi";
import { ApiError, setAuthToken } from "@/services/http";
import type { AuthSession, LoginInput, RegisterInput } from "@/types";

interface AuthState {
  session: AuthSession | null;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  /** Re-read the session from the server (latest profile/addresses); drops an expired login. */
  refresh: () => Promise<void>;
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
      refresh: async () => {
        try {
          set({ session: await meApi() });
        } catch (error) {
          if (error instanceof ApiError && error.status === 401) {
            // Token expired or revoked: treat as signed out.
            setAuthToken(null);
            set({ session: null });
          }
        }
      },
    }),
    { name: "rosado.auth" },
  ),
);
