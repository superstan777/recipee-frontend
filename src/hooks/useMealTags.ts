import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface MealTag {
  id: number;
  tag_name: string;
}

const fetchMealTags = async (user_id: number, meal_type_id: number) => {
  const res = await api.post<MealTag[]>("/sidebar-tags/meal-type", {
    user_id,
    meal_type_id,
  });

  return res.data;
};

export const useMealTags = (
  user_id: number,
  meal_type_id: number,
  options?: Omit<
    UseQueryOptions<MealTag[], Error, MealTag[], [string, number, number]>,
    "queryKey" | "queryFn"
  >
) =>
  useQuery<MealTag[], Error, MealTag[], [string, number, number]>({
    queryKey: ["meal-tags", user_id, meal_type_id],
    queryFn: () => fetchMealTags(user_id, meal_type_id),
    staleTime: Infinity,
    enabled: false, // lazy
    ...options,
  });
