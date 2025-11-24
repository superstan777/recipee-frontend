import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MealTag {
  id: number;
  tag_name: string;
}

const fetchMealTags = async (meal_id: number) => {
  const res = await api.post<MealTag[]>("/meal-tags/tags-for-meal", {
    meal_id,
  });

  return res.data;
};

export const useMealTags = (
  meal_id: number,
  options?: Omit<
    UseQueryOptions<MealTag[], Error, MealTag[], [string, number]>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery<MealTag[], Error, MealTag[], [string, number]>({
    queryKey: ["meal-tags", meal_id],
    queryFn: () => fetchMealTags(meal_id),
    staleTime: Infinity,
    enabled: false, // lazy load
    ...options,
  });
