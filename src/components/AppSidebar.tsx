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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: sidebarData, isLoading, isError } = useSidebar();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedMealTypeId, setSelectedMealTypeId] = React.useState<
    number | null
  >(null);
  const [selectedMealTypeName, setSelectedMealTypeName] = React.useState<
    string | null
  >(null);

  if (isLoading) return <p>Loading sidebar...</p>;
  if (isError) return <p>Error loading sidebar</p>;

  const handleAddTagClick = (mealTypeId: number, mealTypeName: string) => {
    setSelectedMealTypeId(mealTypeId);
    setSelectedMealTypeName(mealTypeName);
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
              {sidebarData?.map((mealType: SidebarMealType) => (
                <SidebarMenuItem key={mealType.id}>
                  <div className="flex items-center justify-between">
                    <SidebarMenuButton asChild className="flex-1">
                      <a href="#" className="font-medium">
                        {mealType.name}
                      </a>
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

      <TagDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mealTypeId={selectedMealTypeId}
        mealTypeName={selectedMealTypeName}
      />
    </>
  );
}
