import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface RateMealParams {
  meal_id: number;
  rating: number | null;
}

const rateMeal = async (meal_id: number, rating: number | null) => {
  const response = await api.patch(`/meals/${meal_id}/rate`, { rating });
  return response.data;
};

export const useRateMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meal_id, rating }: RateMealParams) =>
      rateMeal(meal_id, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
    onError: (err) => {
      console.error("Error rating meal: ", err);
    },
  });
};
