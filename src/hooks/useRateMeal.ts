import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface RateMealParams {
  meal_id: number;
  rating: number | null;
  user_id: number;
}

const rateMeal = async ({ user_id, meal_id, rating }: RateMealParams) => {
  const response = await api.patch(`/meal-statuses/rate`, {
    user_id,
    meal_id,
    rating,
  });
  return response.data;
};

export const useRateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rateMeal,
    onSuccess: () => {
      // invalidujemy tylko meal-statuses, nie meals
      queryClient.invalidateQueries({ queryKey: ["meal-statuses"] });
    },
    onError: (err) => {
      console.error("Error rating meal: ", err);
    },
  });
};
