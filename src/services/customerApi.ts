import { apiGet, apiPost, setAuthToken } from "./http";
import type { AuthSession, LoginInput, RegisterInput } from "@/types";

type SessionResponse = AuthSession & { token?: string };

export async function register(input: RegisterInput): Promise<AuthSession> {
  const { token, ...session } = await apiPost<SessionResponse>("/auth/register", input);
  setAuthToken(token ?? null);
  return session;
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const { token, ...session } = await apiPost<SessionResponse>("/auth/login", input);
  setAuthToken(token ?? null);
  return session;
}

/** Fresh profile + saved addresses for the signed-in customer. */
export async function me(): Promise<AuthSession> {
  return apiGet<AuthSession>("/auth/me");
}

export function logout(): void {
  setAuthToken(null);
  void apiPost("/auth/logout").catch(() => {
    // Token is already cleared locally; a failed server-side revoke isn't user-facing.
  });
}
