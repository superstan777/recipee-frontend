import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface MealStatus {
  meal_id: number;
  rating: number | null;
  new: boolean;
  hidden: boolean;
}

export const fetchMealStatuses = async (
  userId: number,
  mealIds: number[]
): Promise<Record<number, MealStatus>> => {
  if (mealIds.length === 0) return {};

  const res = await api.post<MealStatus[]>("/meal-statuses/batch", {
    userId,
    mealIds,
  });

  const statusMap: Record<number, MealStatus> = {};
  res.data.forEach((status) => {
    statusMap[status.meal_id] = status;
  });

  return statusMap;
};

export const useMealStatuses = (meals: { id: number }[], userId = 1) => {
  const mealIds = meals.map((m) => m.id);

  return useQuery({
    queryKey: ["meal-statuses", userId, mealIds],
    queryFn: () => fetchMealStatuses(userId, mealIds),
    enabled: meals.length > 0,
    staleTime: Infinity,
  });
};
