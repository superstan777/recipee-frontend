import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { AxiosError } from "axios";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userId: number;
}

interface BackendError {
  message: string;
  error?: string;
  statusCode?: number;
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    LoginResponse,
    AxiosError<BackendError>,
    LoginData
  >({
    mutationFn: async (data) => {
      const response = await api.post<LoginResponse>("/auth/login", data, {
        withCredentials: true,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });

  let errorMessage: string | null = null;

  if (mutation.error?.response?.data?.message) {
    const msg = mutation.error.response.data.message;

    switch (msg) {
      case "Invalid email or password":
        errorMessage = "Nieprawidłowy email lub hasło";
        break;
      case "User not found":
        errorMessage = "Nie znaleziono użytkownika";
        break;
      default:
        errorMessage = "Wystąpił błąd logowania";
    }
  }

  return {
    ...mutation,
    errorMessage,
  };
};
