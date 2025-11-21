import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MealTag {
  id: number;
  tag_name: string;
}

const fetchMealTags = async (user_id: number, meal_id: number) => {
  const res = await api.post<MealTag[]>("/meal-tags/tags-for-meal", {
    user_id,
    meal_id,
  });

  return res.data;
};

export const useMealTags = (
  user_id: number,
  meal_id: number,
  options?: Omit<
    UseQueryOptions<MealTag[], Error, MealTag[], [string, number, number]>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery<MealTag[], Error, MealTag[], [string, number, number]>({
    queryKey: ["meal-tags", user_id, meal_id],
    queryFn: () => fetchMealTags(user_id, meal_id),
    staleTime: Infinity,
    enabled: false, // lazy load
    ...options,
  });
