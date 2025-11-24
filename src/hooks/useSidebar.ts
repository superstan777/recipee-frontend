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

const fetchSidebar = async (): Promise<SidebarMealType[]> => {
  const res = await api.post<SidebarMealType[]>("/sidebar");
  return res.data;
};

export const useSidebar = () => {
  return useQuery({
    queryKey: ["sidebar"],
    queryFn: fetchSidebar,
    staleTime: Infinity,
  });
};
