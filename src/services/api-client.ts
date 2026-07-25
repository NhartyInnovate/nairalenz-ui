const getBaseUrl = (): string => {
  // Check VITE_API_BASE_URL or env variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof process !== "undefined" && process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  return "https://api.nairalenz.ai/api/v1";
};

export const AUTH_TOKEN_KEY = "nairalens_auth_token";
export const AUTH_USER_KEY = "nairalens_auth_user";

export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setStoredAuth = (token: string, user: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getStoredUser = (): any | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { isFormData?: boolean } = {}
): Promise<T> {
  const baseUrl = getBaseUrl().replace(/\/$/, "");
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!options.isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        if (typeof errorJson.detail === "string") {
          errorMessage = errorJson.detail;
        } else if (Array.isArray(errorJson.detail)) {
          errorMessage = errorJson.detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
        }
      } else if (errorJson.message) {
        errorMessage = errorJson.message;
      }
    } catch {
      // Failed to parse JSON error
    }

    if (response.status === 401) {
      clearStoredAuth();
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}
