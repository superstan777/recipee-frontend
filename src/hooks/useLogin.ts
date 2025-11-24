import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userId: number;
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post<LoginResponse>("/auth/login", data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);

      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};
