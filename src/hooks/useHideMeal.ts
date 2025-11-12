import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hideMeal as apiHideMeal } from "../api/meals";

interface HideMealParams {
  meal_id: number;
  hidden?: boolean;
}

export const useHideMeal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meal_id, hidden = true }: HideMealParams) =>
      apiHideMeal(meal_id, hidden),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
    onError: (err) => {
      console.error("Error hiding meal: ", err);
    },
  });
};
