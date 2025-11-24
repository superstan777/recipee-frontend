"use client";

import { useState } from "react";
import { Menu, Plus } from "lucide-react";
import { TagDialog } from "@/components/TagDialog";
import { useSidebar, type SidebarMealType } from "@/hooks/useSidebar";
import { useFiltersStore } from "@/store/filters";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function MobileSidebarMenu() {
  const [open, setOpen] = useState(false);
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

  if (isLoading || isError) return null;

  const handleAddTagClick = (mealTypeId: number, mealTypeName: string) => {
    setDialogMealTypeId(mealTypeId);
    setDialogMealTypeName(mealTypeName);
    setDialogOpen(true);
  };

  const handleSelectMealType = (mealTypeId: number) => {
    setMealTypeId(mealTypeId);
    setOpen(false);
  };

  const handleSelectTag = (tagId: number) => {
    setTagId(tagId);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-white flex items-center justify-center text-white shadow-xl z-50"
      >
        <Menu size={28} color="black" />
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto p-4`}
      >
        <h2 className="text-lg font-semibold mb-4">Recipee</h2>
        {sidebarData?.map((mealType: SidebarMealType) => (
          <div key={mealType.id} className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <SidebarMenuButton
                isActive={selectedMealTypeId === mealType.id}
                className="flex-1 text-left"
                onClick={() => handleSelectMealType(mealType.id)}
              >
                {mealType.name}
              </SidebarMenuButton>
              <SidebarMenuButton
                onClick={() => handleAddTagClick(mealType.id, mealType.name)}
                className="w-auto px-2 shrink-0"
              >
                <Plus size={16} />
              </SidebarMenuButton>
            </div>

            {mealType.tags?.length > 0 && (
              <div className="pl-4">
                {mealType.tags.map((tag) => (
                  <SidebarMenuButton
                    key={tag.id}
                    isActive={selectedTagId === tag.id}
                    className="block w-full text-left mb-1 px-2 py-1"
                    onClick={() => handleSelectTag(tag.id)}
                  >
                    {tag.tag_name}
                  </SidebarMenuButton>
                ))}
              </div>
            )}
          </div>
        ))}

        <TagDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mealTypeId={dialogMealTypeId}
          mealTypeName={dialogMealTypeName}
        />
      </div>
    </>
  );
}
