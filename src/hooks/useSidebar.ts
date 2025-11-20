import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface SidebarTag {
  id: number;
  tag_name: string;
}

export interface SidebarMealType {
  id: number;
  name: string;
  tags: SidebarTag[];
}

const fetchSidebar = async (user_id: number): Promise<SidebarMealType[]> => {
  const res = await api.post<SidebarMealType[]>("/sidebar", { user_id });
  return res.data;
};

export const useSidebar = (user_id: number) => {
  return useQuery({
    queryKey: ["sidebar", user_id],
    queryFn: () => fetchSidebar(user_id),
    staleTime: Infinity,
    enabled: !!user_id,
  });
};
