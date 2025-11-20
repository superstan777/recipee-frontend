import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from "@tanstack/react-query";
import type { MealsPage } from "../types/meals";
import { api } from "../lib/api";

interface MealsFilters {
  mealTypeId?: number | null;
  tagId?: number | null;
  userId: number;
}

interface MealsRequest extends MealsFilters {
  limit: number;
  cursor?: number | null;
}

const fetchMeals = async (
  cursor: number | null,
  filters: MealsFilters
): Promise<MealsPage> => {
  const body: MealsRequest = {
    ...filters,
    limit: 30,
    ...(cursor !== null ? { cursor } : {}),
  };

  const response = await api.post<MealsPage>("/meals/meals", body);
  return response.data;
};

export const useMeals = (filters: MealsFilters) => {
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
