import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface HideMealParams {
  meal_id: number;
  user_id: number;
}

const hideMeal = async (meal_id: number, user_id: number) => {
  const response = await api.patch(`/meal-statuses/hide`, {
    meal_id,
    user_id,
  });
  return response.data;
};

export const useHideMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meal_id, user_id }: HideMealParams) =>
      hideMeal(meal_id, user_id),

    onSuccess: (_, variables) => {
      const mealId = variables.meal_id;

      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["meal-statuses"], exact: false })
        .forEach((query) => {
          const key = query.queryKey as any[];
          const mealIds = key[2];

          if (Array.isArray(mealIds) && mealIds.includes(mealId)) {
            queryClient.invalidateQueries({ queryKey: key });
          }
        });

      // robimy refetch wszystkiego - do poprawy pozniej aby matchowalo z konkretna strona meals
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },

    onError: (err) => {
      console.error("Error hiding meal: ", err);
    },
  });
};
