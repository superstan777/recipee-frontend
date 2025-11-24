import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface AddSidebarTagParams {
  meal_type_id: number;
  tag_name: string;
}

const addSidebarTag = async ({
  meal_type_id,
  tag_name,
}: AddSidebarTagParams) => {
  const res = await api.post("/sidebar-tags", {
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
