import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import type { MealsResponse } from "../types/meals";
import { api } from "../api/axios";

interface MealsFilters {
  mealTypeId?: number | null;
  tagId?: number | null;
}

const fetchMeals = async (
  cursor: number | null,
  filters: MealsFilters = {}
): Promise<MealsResponse> => {
  const params: Record<string, any> = { ...filters, limit: 30 };
  if (cursor !== null) params.cursor = cursor;

  const response = await api.get<MealsResponse>("/meals", { params });
  return response.data;
};

export const useMeals = (filters: MealsFilters = {}) => {
  return useInfiniteQuery<
    MealsResponse,
    Error,
    MealsResponse,
    ["meals", MealsFilters],
    number | null
  >({
    queryKey: ["meals", filters],
    queryFn: ({
      pageParam,
    }: QueryFunctionContext<["meals", MealsFilters], number | null>) =>
      fetchMeals(pageParam ?? null, filters),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
