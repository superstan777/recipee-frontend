import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/api/axios";

export interface MealTag {
  id: number;
  meal: { id: number; name: string };
  tag: { id: number; tag_name: string };
}

const fetchMealTags = async (mealId: number) => {
  const res = await api.get<MealTag[]>(`/meal-tags/${mealId}`);
  return res.data;
};

export const useMealTags = (
  mealId: number,
  options?: Omit<
    UseQueryOptions<MealTag[], Error, MealTag[], [string, number]>,
    "queryKey"
  >
) =>
  useQuery<MealTag[], Error, MealTag[], [string, number]>({
    queryKey: ["meal-tags", mealId],
    queryFn: () => fetchMealTags(mealId),
    staleTime: Infinity,
    enabled: false, // zawsze lazy
    ...options,
  });
