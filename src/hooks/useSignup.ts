import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { AxiosError } from "axios";

interface SignupData {
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
}

interface BackendError {
  message: string;
  error?: string;
  statusCode?: number;
}

export const useSignup = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    SignupResponse,
    AxiosError<BackendError>,
    SignupData
  >({
    mutationFn: async (data) => {
      const response = await api.post<SignupResponse>("/auth/signup", data, {
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
      case "User already exists":
        errorMessage = "Użytkownik z tym emailem już istnieje";
        break;
      default:
        errorMessage = "Wystąpił błąd podczas rejestracji";
    }
  }

  return {
    ...mutation,
    errorMessage,
  };
};
