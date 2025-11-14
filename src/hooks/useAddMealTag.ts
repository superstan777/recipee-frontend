import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

export interface AddMealTagParams {
  meal_id: number;
  tag_id: number;
}

const addMealTag = async ({ meal_id, tag_id }: AddMealTagParams) => {
  const res = await api.post("/meal-tags", { meal_id, tag_id });
  return res.data;
};

export const useAddMealTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addMealTag,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["meal-tags", variables.meal_id],
      });
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
    onError: (err) => {
      console.error("Błąd dodawania tagu do posiłku:", err);
    },
  });
};
