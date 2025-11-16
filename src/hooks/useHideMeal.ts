import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

interface HideMealParams {
  meal_id: number;
  hidden?: boolean;
}

const hideMeal = async (meal_id: number, hidden = true) => {
  const response = await api.patch(`/meals/${meal_id}/hide`, { hidden });
  return response.data;
};

export const useHideMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meal_id, hidden = true }: HideMealParams) =>
      hideMeal(meal_id, hidden),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
    onError: (err) => {
      console.error("Error hiding meal: ", err);
    },
  });
};
