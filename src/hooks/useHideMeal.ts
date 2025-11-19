import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface HideMealParams {
  meal_id: number;
  userId: number;
}

const hideMeal = async (meal_id: number, userId: number) => {
  const response = await api.patch(`/meal-statuses/hide`, {
    mealId: meal_id, // nowy body param
    userId,
  });
  return response.data;
};

export const useHideMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meal_id, userId }: HideMealParams) =>
      hideMeal(meal_id, userId),

    onSuccess: (_, variables) => {
      const mealId = variables.meal_id;

      // Szukamy wszystkich cache, które zawierają tego mealId (jak wcześniej)
      queryClient
        .getQueryCache()
        .findAll({
          queryKey: ["meal-statuses"],
          exact: false,
        })
        .forEach((query) => {
          const key = query.queryKey as any[];

          // key = ["meal-statuses", userId, mealIds[]]
          const mealIds = key[2];

          if (Array.isArray(mealIds) && mealIds.includes(mealId)) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        });
    },

    onError: (err) => {
      console.error("Error hiding meal: ", err);
    },
  });
};
