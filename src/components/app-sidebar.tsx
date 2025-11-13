import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { useSidebar, type SidebarMealType } from "@/hooks/useSidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: sidebarData, isLoading, isError } = useSidebar();

  if (isLoading) return <p>Loading sidebar...</p>;
  if (isError) return <p>Error loading sidebar</p>;

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Recipee</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {sidebarData?.map((mealType: SidebarMealType) => (
              <SidebarMenuItem key={mealType.id}>
                <SidebarMenuButton asChild>
                  <a href="#" className="font-medium">
                    {mealType.name}
                  </a>
                </SidebarMenuButton>
                {mealType.tags?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {mealType.tags.map((tag) => (
                      <SidebarMenuSubItem key={tag.id}>
                        <SidebarMenuSubButton asChild>
                          <a href="#">{tag.tag_name}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
