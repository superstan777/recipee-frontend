"use client";

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
import { Plus } from "lucide-react";
import { TagDialog } from "@/components/TagDialog";
import { useFiltersStore } from "@/store/filters";
import { useState } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: sidebarData, isLoading, isError } = useSidebar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMealTypeId, setDialogMealTypeId] = useState<number | null>(null);
  const [dialogMealTypeName, setDialogMealTypeName] = useState<string | null>(
    null
  );

  const { selectedMealTypeId, selectedTagId, setMealTypeId, setTagId } =
    useFiltersStore();

  if (isLoading) return <p>Loading sidebar...</p>;
  if (isError) return <p>Error loading sidebar</p>;

  const handleAddTagClick = (mealTypeId: number, mealTypeName: string) => {
    setDialogMealTypeId(mealTypeId);
    setDialogMealTypeName(mealTypeName);
    setDialogOpen(true);
  };

  const isMealTypeActive = (mealTypeId: number) =>
    selectedMealTypeId === mealTypeId;
  const isTagActive = (tagId: number) => selectedTagId === tagId;

  return (
    <Sidebar variant="floating" {...props} className="p-4 pr-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <span className="font-medium">Recipee</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {sidebarData?.map((mealType: SidebarMealType) => (
              <SidebarMenuItem key={mealType.id}>
                <div className="flex items-center justify-between">
                  <SidebarMenuButton
                    isActive={isMealTypeActive(mealType.id)}
                    className="flex-1"
                    onClick={() => setMealTypeId(mealType.id)}
                  >
                    {mealType.name}
                  </SidebarMenuButton>

                  <SidebarMenuButton
                    onClick={() =>
                      handleAddTagClick(mealType.id, mealType.name)
                    }
                    tooltip="Add new tag"
                    className="w-auto px-2 shrink-0"
                  >
                    <Plus />
                  </SidebarMenuButton>
                </div>

                {mealType.tags?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {mealType.tags.map((tag) => (
                      <SidebarMenuSubItem key={tag.id}>
                        <SidebarMenuSubButton
                          isActive={isTagActive(tag.id)}
                          onClick={() => setTagId(tag.id)}
                        >
                          {tag.tag_name}
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
      <TagDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mealTypeId={dialogMealTypeId}
        mealTypeName={dialogMealTypeName}
      />
    </Sidebar>
  );
}
