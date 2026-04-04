import { api, setAuthTokens, clearAuthTokens } from "./api";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    setAuthTokens(data.data.accessToken, data.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    setAuthTokens(data.data.accessToken, data.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.data.user));
    return data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      await api.post("/auth/logout", { refreshToken });
    } finally {
      clearAuthTokens();
    }
  },
};
