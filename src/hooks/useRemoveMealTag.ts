import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface RemoveMealTagParams {
  user_id: number;
  meal_id: number;
  tag_id: number;
}

const removeMealTag = async ({
  user_id,
  meal_id,
  tag_id,
}: RemoveMealTagParams) => {
  const res = await api.delete("/meal-tags", {
    data: { user_id, meal_id, tag_id },
  });

  return res.data;
};

export const useRemoveMealTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeMealTag,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meal-tags", variables.user_id, variables.meal_id],
      });
    },

    onError: (err) => {
      console.error("Błąd usuwania tagu z posiłku:", err);
    },
  });
};
