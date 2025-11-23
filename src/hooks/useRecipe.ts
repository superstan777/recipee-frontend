import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

interface ingredients {
  name: string;
  quantity: string;
}
export interface Recipe {
  meal_id: number;
  ingredients: ingredients[];
  instructions: string[];
}

export const useRecipe = (meal_id?: number) => {
  const query = useQuery<Recipe, Error>({
    queryKey: ["recipe", meal_id],
    queryFn: async () => {
      const response = await api.post<Recipe>("/recipes/get-recipe", {
        meal_id,
      });
      return response.data;
    },
    enabled: !!meal_id, // query wykona się tylko jeśli meal_id istnieje
    retry: false, // nie powtarzamy automatycznie przy błędzie
  });

  return {
    recipe: query.data ?? null,
    loading: query.isFetching,
    error: query.error?.message ?? null,
  };
};
