import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Image {
  id: number;
  url: string;
  title?: string;
}

export const useGetRandomImage = () => {
  const query = useQuery<Image, Error>({
    queryKey: ["random-image"],
    queryFn: async () => {
      const response = await api.get<Image>("/images/random");
      return response.data;
    },
    staleTime: Infinity, // nie odświeżaj automatycznie
    gcTime: Infinity, // nie wyrzucaj z cache
    retry: false, // bez retry
  });

  return {
    image: query.data ?? null,
    loading: query.isFetching,
    error: query.error?.message ?? null,
    refetch: query.refetch, // możesz ręcznie wymusić losowanie kolejnego
  };
};
