import { apiClient, setStoredAuth, clearStoredAuth, getStoredUser } from "./api-client";
import { User, AuthResponseData, ApiResponse } from "@/types/api";

export const authService = {
  async register(data: { email: string; full_name: string; password: string }): Promise<ApiResponse<{ user: User }>> {
    const res = await apiClient<ApiResponse<{ user: User }>>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponseData> {
    const res = await apiClient<ApiResponse<AuthResponseData>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    if (res.data?.access_token && res.data?.user) {
      setStoredAuth(res.data.access_token, res.data.user);
      return res.data;
    } else if ((res as any).access_token) {
      // Fallback if returned directly
      const token = (res as any).access_token;
      const user = (res as any).user;
      setStoredAuth(token, user);
      return { access_token: token, token_type: "bearer", user };
    }
    
    throw new Error("Invalid response format from login endpoint.");
  },

  async getCurrentUser(): Promise<User> {
    const res = await apiClient<ApiResponse<User>>("/auth/me", {
      method: "GET",
    });
    return res.data;
  },

  logout(): void {
    clearStoredAuth();
  },

  getLocalUser(): User | null {
    return getStoredUser();
  },
};
