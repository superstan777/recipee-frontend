import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface MealStatus {
  meal_id: number;
  rating: number | null;
  new: boolean;
  hidden: boolean;
}

export const fetchMealStatuses = async (
  meal_ids: number[]
): Promise<Record<number, MealStatus>> => {
  if (meal_ids.length === 0) return {};

  const res = await api.post<MealStatus[]>("/meal-statuses/batch", {
    meal_ids,
  });

  const statusMap: Record<number, MealStatus> = {};
  res.data.forEach((status) => {
    statusMap[status.meal_id] = status;
  });

  return statusMap;
};

export const useMealStatuses = (meals: { id: number }[]) => {
  const meal_ids = meals.map((m) => m.id);

  return useQuery({
    queryKey: ["meal-statuses", meal_ids],
    queryFn: () => fetchMealStatuses(meal_ids),
    enabled: meals.length > 0,
    staleTime: Infinity,
  });
};
