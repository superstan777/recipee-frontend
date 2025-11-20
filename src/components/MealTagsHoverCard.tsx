import { useState, useEffect } from "react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag } from "lucide-react";
import { Label } from "./ui/label";

import { useMealTags } from "@/hooks/useMealTags";
import { useAddMealTag } from "@/hooks/useAddMealTag";
import { useRemoveMealTag } from "@/hooks/useRemoveMealTag";
import { useIsMobile } from "@/hooks/use-mobile";

interface MealTagsHoverCardProps {
  meal_id: number;
  sidebarTags: { id: number; tag_name: string }[];
}

export const MealTagsHoverCard: React.FC<MealTagsHoverCardProps> = ({
  meal_id,
  sidebarTags,
}) => {
  const currentUser = 1;
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const {
    data: mealTags,
    isLoading,
    refetch,
  } = useMealTags(currentUser, meal_id);

  const addMealTag = useAddMealTag();
  const removeMealTag = useRemoveMealTag();

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  const handleToggleTag = (tagId: number) => {
    const isSelected = mealTags?.some((mt) => mt.id === tagId);
    const mutation = isSelected ? removeMealTag : addMealTag;

    mutation.mutate(
      { meal_id, tag_id: tagId },
      {
        onSettled: () => {
          // zamiast invalidateQueries -> wywołujemy refetch ręcznie
          refetch();
        },
      }
    );
  };

  const handleTriggerClick = () => {
    if (isMobile) setOpen((prev) => !prev);
  };

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>
        <button
          onClick={handleTriggerClick}
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-100 transition cursor-pointer"
          aria-label="Show tags"
        >
          <Tag size={20} color="black" />
        </button>
      </HoverCardTrigger>

      <HoverCardContent side="right" align="start" className="w-auto">
        <div className="text-sm mb-2">Dodaj tagi</div>

        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div className="text-sm text-gray-500">Ładowanie…</div>
          ) : sidebarTags.length === 0 ? (
            <div className="text-sm text-gray-500">Brak tagów do dodania</div>
          ) : (
            sidebarTags.map((tag) => {
              const tagId = `meal-tag-${meal_id}-${tag.id}`;
              const isChecked = mealTags?.some((mt) => mt.id === tag.id);

              return (
                <div
                  key={tag.id}
                  className="flex items-center space-x-2 text-sm"
                >
                  <Checkbox
                    id={tagId}
                    checked={!!isChecked}
                    onCheckedChange={() => handleToggleTag(tag.id)}
                    className="cursor-pointer"
                  />
                  <Label htmlFor={tagId} className="cursor-pointer">
                    {tag.tag_name}
                  </Label>
                </div>
              );
            })
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
