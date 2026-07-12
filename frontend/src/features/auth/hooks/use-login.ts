import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../../../services/api/client";
import { useAuthStore } from "../../../stores/auth.store";
import type { LoginForm } from "../validations/auth.schema";

interface LoginResponse {
  token: string;
}

export function useLogin() {
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiClient.post<{ data: LoginResponse }>("/auth/login", data);
      return response.data.data;
    },
    onSuccess: (data) => {
      login(data.token);
    },
  });
}
