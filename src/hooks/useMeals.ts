import { useInfiniteQuery } from "@tanstack/react-query";
import type { MealsResponse } from "../types/meals";
import { api } from "../api/axios";

const fetchMeals = async (cursor: number | null): Promise<MealsResponse> => {
  const params: Record<string, any> = { limit: 30 };
  if (cursor) params.cursor = cursor;

  const response = await api.get<MealsResponse>("/meals", { params });
  return response.data;
};

export const useMeals = () => {
  return useInfiniteQuery<
    MealsResponse,
    Error,
    MealsResponse,
    ["meals"],
    number | null
  >({
    queryKey: ["meals"],
    queryFn: ({ pageParam = null }) => fetchMeals(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
