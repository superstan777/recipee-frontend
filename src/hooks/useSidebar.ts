import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export interface SidebarTag {
  id: number;
  tag_name: string;
}

export interface SidebarMealType {
  id: number;
  name: string;
  tags: SidebarTag[];
}

export const fetchSidebar = async (): Promise<SidebarMealType[]> => {
  const res = await api.get<SidebarMealType[]>("/sidebar");
  return res.data;
};

export const useSidebar = () => {
  return useQuery({
    queryKey: ["sidebar"],
    queryFn: fetchSidebar,
    staleTime: Infinity,
  });
};
