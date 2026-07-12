import { apiClient } from "../../../services/api/client";
import type { LoginForm } from "../validations/auth.schema";

interface LoginResponse {
  token: string;
}

export const authService = {
  login: async (data: LoginForm): Promise<LoginResponse> => {
    const response = await apiClient.post<{ data: LoginResponse }>("/auth/login", data);
    return response.data.data;
  },
};
