import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import type { MealsPage } from "../types/meals";
import { api } from "../lib/api";

interface MealsFilters {
  mealTypeId?: number | null;
  tagId?: number | null;
}

const fetchMeals = async (
  cursor: number | null,
  filters: MealsFilters = {}
): Promise<MealsPage> => {
  const params: Record<string, any> = { ...filters, limit: 30 };
  if (cursor !== null) params.cursor = cursor;

  const response = await api.get<MealsPage>("/meals", { params });
  return response.data;
};

// Hook zwracający MealsInfiniteResponse (react-query zrobi opakowanie)
export const useMeals = (filters: MealsFilters = {}) => {
  return useInfiniteQuery<
    MealsPage,
    Error,
    MealsPage,
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
