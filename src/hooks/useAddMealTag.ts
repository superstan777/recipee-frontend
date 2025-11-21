import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface AddMealTagParams {
  user_id: number;
  meal_id: number;
  tag_id: number;
}

const addMealTag = async ({ user_id, meal_id, tag_id }: AddMealTagParams) => {
  const res = await api.post("/meal-tags", {
    user_id,
    meal_id,
    tag_id,
  });

  return res.data;
};

export const useAddMealTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMealTag,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meal-tags", variables.user_id, variables.meal_id],
      });
    },

    onError: (err) => {
      console.error("Błąd dodawania tagu do posiłku:", err);
    },
  });
};
