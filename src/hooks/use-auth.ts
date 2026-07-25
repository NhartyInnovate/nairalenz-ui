import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { User } from "@/types/api";
import { getStoredToken } from "@/services/api-client";

export function useAuth() {
  const queryClient = useQueryClient();
  const token = getStoredToken();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      if (!getStoredToken()) return null;
      try {
        return await authService.getCurrentUser();
      } catch (err) {
        // Fallback to local stored user if backend offline or fails
        return authService.getLocalUser();
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], data.user);
      queryClient.invalidateQueries();
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
  });

  const logout = () => {
    authService.logout();
    queryClient.setQueryData(["auth", "me"], null);
    queryClient.clear();
  };

  return {
    user: user || authService.getLocalUser(),
    isLoading,
    isAuthenticated: Boolean(token || user),
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
    refetchUser: refetch,
  };
}
