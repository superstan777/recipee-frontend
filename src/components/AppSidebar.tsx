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

  const selectedMealTypeId = useFiltersStore(
    (state) => state.selectedMealTypeId
  );
  const selectedTagId = useFiltersStore((state) => state.selectedTagId);
  const setMealTypeId = useFiltersStore((state) => state.setMealTypeId);
  const setTagId = useFiltersStore((state) => state.setTagId);

  if (isLoading) return <p>Loading sidebar...</p>;
  if (isError) return <p>Error loading sidebar</p>;

  const handleAddTagClick = (mealTypeId: number, mealTypeName: string) => {
    setDialogMealTypeId(mealTypeId);
    setDialogMealTypeName(mealTypeName);
    setDialogOpen(true);
  };

  return (
    <>
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
              {sidebarData?.map((mealType: SidebarMealType) => {
                const isMealTypeSelected = mealType.id === selectedMealTypeId;

                return (
                  <SidebarMenuItem key={mealType.id}>
                    <div className="flex items-center justify-between">
                      <SidebarMenuButton
                        asChild
                        className={`flex-1 ${
                          isMealTypeSelected
                            ? "rounded px-2 py-1 font-medium text-gray-900"
                            : "font-medium text-gray-700"
                        }`}
                        onClick={() => setMealTypeId(mealType.id)}
                      >
                        <a href="#">{mealType.name}</a>
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
                        {mealType.tags.map((tag) => {
                          const isTagSelected = tag.id === selectedTagId;
                          return (
                            <SidebarMenuSubItem key={tag.id}>
                              <SidebarMenuSubButton
                                asChild
                                className={`${
                                  isTagSelected
                                    ? "rounded px-2 py-1 font-medium text-gray-900"
                                    : "text-gray-700"
                                }`}
                                onClick={() => setTagId(tag.id)}
                              >
                                <a href="#">{tag.tag_name}</a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <TagDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mealTypeId={dialogMealTypeId}
        mealTypeName={dialogMealTypeName}
      />
    </>
  );
}
