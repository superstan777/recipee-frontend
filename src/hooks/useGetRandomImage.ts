import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Image {
  id: number;
  url: string;
  title?: string;
}

export const useGetRandomImage = (enabled: boolean = true) => {
  const query = useQuery<Image, Error>({
    queryKey: ["random-image"],
    queryFn: async () => {
      const response = await api.get<Image>("/images/random");
      return response.data;
    },
    enabled, // <-- KLUCZOWE
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });

  return {
    image: query.data ?? null,
    loading: query.isFetching,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
};
