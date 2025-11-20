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

type MealStatusesQueryKey = ["meal-statuses", number, number[]];

export const useHideMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meal_id, user_id }: HideMealParams) =>
      hideMeal(meal_id, user_id),

    onSuccess: (_, variables) => {
      const mealId = variables.meal_id;

      const queries = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["meal-statuses"], exact: false });

      queries.forEach((query) => {
        const key = query.queryKey;

        if (
          Array.isArray(key) &&
          key.length === 3 &&
          key[0] === "meal-statuses" &&
          typeof key[1] === "number" &&
          Array.isArray(key[2])
        ) {
          const typedKey = key as MealStatusesQueryKey;
          const mealIds = typedKey[2];

          if (mealIds.includes(mealId)) {
            queryClient.invalidateQueries({ queryKey: typedKey });
          }
        }
      });

      // Do zoptymalizowania: invalidujemy wszystkie pages of meals
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },

    onError: (err) => {
      console.error("Error hiding meal: ", err);
    },
  });
};
