import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface AddSidebarTagParams {
  meal_type_id: number;
  tag_name: string;
  user_id: number; // <- dodane
}

const addSidebarTag = async ({
  user_id, // <- dodane
  meal_type_id,
  tag_name,
}: AddSidebarTagParams) => {
  const res = await api.post("/sidebar-tags", {
    user_id,
    meal_type_id,
    tag_name,
  });
  return res.data;
};

export const useAddSidebarTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSidebarTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar"] });
    },
    onError: (err) => {
      console.error("Error adding sidebar tag:", err);
    },
  });
};
