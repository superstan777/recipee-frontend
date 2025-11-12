import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchMeals } from "../api/meals";
import type { MealsResponse } from "../types/meals";

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
