import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface MealStatus {
  meal: { id: number };
  rating: number | null;
  new: boolean;
  hidden: boolean;
}

export const fetchMealStatuses = async (
  userId: number,
  mealIds: number[]
): Promise<Record<number, MealStatus>> => {
  if (mealIds.length === 0) return {};

  const res = await api.get<MealStatus[]>("/meal-statuses", {
    params: {
      userId,
      mealIds: mealIds.join(","),
    },
  });

  const statusMap: Record<number, MealStatus> = {};
  res.data.forEach((status) => {
    statusMap[status.meal.id] = status;
  });
  return statusMap;
};

export const useMealStatuses = (meals: { id: number }[], userId = 1) => {
  const mealIds = meals.map((m) => m.id);

  return useQuery({
    queryKey: ["meal-statuses", userId, mealIds],
    queryFn: () => fetchMealStatuses(userId, mealIds),
    enabled: meals.length > 0,
    staleTime: Infinity, // możemy ustawić Infinity, bo statusy nie zmieniają się same z siebie
  });
};
